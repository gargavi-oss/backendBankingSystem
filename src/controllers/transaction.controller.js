const transactionModel = require("../models/transaction.model.js");
const ledgerModel = require("../models/ledger.model.js");
const accountModel = require("../models/account.model.js");
const emailService = require("../services/email.js");
const mongoose = require("mongoose");
const userModel = require("../models/user.model.js");

async function createTransaction(req, res) {
    const { fromAccount, toAccount, idempotencyKey, amount } = req.body;

    // 1. Upfront payload validations
    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "Data is missing for transaction"
        });
    }

    if (Number(amount) <= 0) {
        return res.status(400).json({ message: "Transaction amount must be greater than zero" });
    }

    try {
        // 2. Look up accounts safely using Promise.all
        const [fromUserAccount, toUserAccount] = await Promise.all([
            accountModel.findById(fromAccount),
            accountModel.findById(toAccount)
        ]);

        // Guard against null pointer exception crashes
        if (!fromUserAccount || !toUserAccount) {
            // Write explicit failure record to burn the idempotency key state
            await transactionModel.create({
                from: fromAccount, to: toAccount, amount, idempotencyKey, status: "FAILED"
            }).catch(err => console.error("Idempotency lock failure:", err.message));

            return res.status(400).json({
                message: "Invalid fromAccount or toAccount"
            });
        }

        // 3. Handle Idempotency early using a state map
        const isTransactionAlreadyExists = await transactionModel.findOne({ idempotencyKey });
        if (isTransactionAlreadyExists) {
            const statusMap = {
                COMPLETED: { code: 200, json: { message: "Transaction already processed", transaction: isTransactionAlreadyExists } },
                PENDING: { code: 202, json: { message: "Transaction is still processing" } },
                FAILED: { code: 409, json: { message: "Transaction processing failed. Please use a new key." } },
                REVERSED: { code: 409, json: { message: "Transaction was reversed. Please retry with a new key." } }
            };
            const response = statusMap[isTransactionAlreadyExists.status] || { code: 500, json: { message: "Unknown transaction state" } };
            return res.status(response.code).json(response);
        }

        // 4. Validate Account Statuses
        if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
            await transactionModel.create({
                from: fromAccount, to: toAccount, amount, idempotencyKey, status: "FAILED"
            }).catch(err => console.error("Idempotency lock failure:", err.message));

            await emailService.sendFailedTransactionEmail(
                req.user.email, req.user.name, amount, toAccount, "Account Frozen or Closed"
            );
            return res.status(400).json({
                message: "Both fromAccount and toAccount must be Active to process transaction"
            });
        }

        // 5. Atomic Balance Check
        const balance = await fromUserAccount.getBalance();
        if (balance < amount) {
            await transactionModel.create({
                from: fromAccount, to: toAccount, amount, idempotencyKey, status: "FAILED"
            }).catch(err => console.error("Idempotency lock failure:", err.message));

            await emailService.sendFailedTransactionEmail(
                req.user.email, req.user.name, amount, toAccount, "Insufficient Balance"
            );
            return res.status(400).json({
                message: `Insufficient funds in the account. Current balance is ${balance}. Requested Amount is ${amount}`
            });
        }

        // 6. Execute ACID Compliant Mongoose Session
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // passing an array to .create() returns an array of documents back
            const [newTransaction] = await transactionModel.create([{
                from: fromAccount, to: toAccount, amount, idempotencyKey, status: "PENDING"
            }], { session });

            // Create ledger updates
            await ledgerModel.create([
                { account: fromAccount, amount, transaction: newTransaction._id, type: "DEBIT" },
                { account: toAccount, amount, transaction: newTransaction._id, type: "CREDIT" }
            ], { session,ordered:true });

            // Mark complete
            newTransaction.status = "COMPLETED";
            await newTransaction.save({ session });

            await session.commitTransaction();
            session.endSession();

            // Background Notification
            emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toAccount);
            
            return res.status(201).json({
                message: "Transaction completed successfully",
                transaction: newTransaction
            });

        } catch (txError) {
            // Roll back operations if database errors crop up mid-flight
            await session.abortTransaction();
            session.endSession();

            // Persist the FAILED status cleanly outside the session boundary
            await transactionModel.create({
                from: fromAccount, to: toAccount, amount, idempotencyKey, status: "FAILED"
            }).catch(err => console.error("Failed to commit final failure state:", err.message));

            throw txError;
        }

    } catch (error) {
        console.error("System Failure on createTransaction:", error);
        return res.status(500).json({ message: "Internal server error processing transaction" });
    }
}

async function createIntialFundsTransaction(req, res) {
    const { toAccount, amount, idempotencyKey } = req.body;

    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({ message: "toAccount, amount, and idempotencyKey are required" });
    }

    try {
        const toUserAccount = await accountModel.findById(toAccount);
        if (!toUserAccount) {
            return res.status(400).json({ message: "Invalid to Account" });
        }

        const fromUserAccount = await userModel.findOne({
            systemUser: true,
            _id: req.user._id
        });

        if (!fromUserAccount) {
            return res.status(403).json({ message: "System user account not found" });
        }

        // Idempotency check for initial funding
        const existingTx = await transactionModel.findOne({ idempotencyKey });
        if (existingTx) {
            return res.status(200).json({ message: "Initial funding already processed", transaction: existingTx });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const [transaction] = await transactionModel.create([{
                from: fromUserAccount._id,
                to: toAccount,
                amount,
                idempotencyKey,
                status: "PENDING"
            }], { session });

            await ledgerModel.create([
                { account: fromUserAccount._id, amount, transaction: transaction._id, type: "DEBIT" },
                { account: toAccount, amount, transaction: transaction._id, type: "CREDIT" }
            ], { session ,ordered:true });

            transaction.status = "COMPLETED";
            await transaction.save({ session });

            await session.commitTransaction();
            session.endSession();

            return res.status(201).json({
                message: "Initial funds transaction Completed",
                transaction: transaction
            });

        } catch (txError) {
            await session.abortTransaction();
            session.endSession();

            await transactionModel.create({
                from: fromUserAccount._id, to: toAccount, amount, idempotencyKey, status: "FAILED"
            }).catch(err => console.error("Initial funding fallback save failed:", err.message));

            throw txError;
        }

    } catch (error) {
        console.error("System Failure on createInitialFundsTransaction:", error);
        return res.status(500).json({ message: "Internal server error assigning system funds" });
    }
}

module.exports = {
    createTransaction,
    createIntialFundsTransaction
};