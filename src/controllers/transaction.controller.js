const transactionModel = require("../models/transaction.model.js");
const ledgerModel= require("../models/ledger.model.js");
const accountModel = require("../models/account.model.js");
const emailService = require("../services/email.js");
const authMiddleware = require('../middlewares/auth.middleware.js');
const mongoose = require("mongoose");
const userModel = require("../models/user.model.js");

async function createTransaction(req,res){
    const {fromAccount,toAccount,idempotencyKey,amount}= req.body;
    if(!fromAccount || !toAccount||!amount|| !idempotencyKey){
        return res.status(400).json({
            message: "Data is missing for transaction"
        });
    }
    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount
    });
    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    });
    if(!fromUserAccount|| !toUserAccount){
        emailService.sendFailedTransactionEmail(
            fromUserAccount.email,
            fromUserAccount.name,
            amount,
            toAccount,
            "Invalid Recipient Account"
        );
        return res.status(400).json({
            message:"Invalid fromAccount or toAccount"
        })
    }
    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    })
    if(isTransactionAlreadyExists){
        if(isTransactionAlreadyExists.status === "COMPLETED"){
            return res.status(200).json({
                message:"Transaction already processed",
                transaction: isTransactionAlreadyExists
            })
        } 
        if(isTransactionAlreadyExists.status==="PENDING"){
            return res.status(200).json({
                message:"Transaction is still processing"
            })
        }
        if(isTransactionAlreadyExists.status==="FAILED"){
            return res.status(500).json({
                message:"Transaction processing failed"
            })
        }
        if(isTransactionAlreadyExists.status==="REVERSED"){
            return res.status(500).json({
                message:"Transaction was reversed. Please retry"
            })
        }
    }
    if(fromUserAccount.status!=="ACTIVE"||toUserAccount.status!=="ACTIVE"){
        emailService.sendFailedTransactionEmail(
            req.user.email,
            req.user.name,
            amount,
            toAccount,
            "Account Frozen or Closed"
        );
        return res.status(500).json({
            message: "Both fromAccount and toAccount must be Active to process transaction"
        })
    }
    const balance = await fromUserAccount.getBalance()
    if(balance<amount){
        emailService.sendFailedTransactionEmail(
            req.user.email,
            req.user.name,
            amount,
            toAccount,
            "Insufficient Balance"
        );
        return res.status(400).json({
            message: `Insufficient funds in the account. Current balance is ${balance}. Requested Amount is ${amount}`
        })
    }
    const session = await mongoose.startSession();
    session.startTransaction();

    const newTransaction = await transactionModel.create({
        from:fromAccount,to:toAccount,amount,idempotencyKey,status:"PENDING"
    })
    await newTransaction.save({session})

    const debitLedgerEntry = await ledgerModel.create([{
        account: fromAccount,
        amount: amount,
        transaction: newTransaction._id,
        type:"DEBIT"
    }],{session})
    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount,
        amount: amount,
        transaction: newTransaction._id,
        type:"CREDIT"
    }],{session})
    
    newTransaction.status = "COMPLETED";
    await newTransaction.save({session});
    await session.commitTransaction();
    session.endSession();
    emailService.sendTransactionEmail(fromUserAccount.email,fromUserAccount.name,amount,toAccount);
    return res.status(201).json({
        message:"Transaction completed sucessfully",
        transaction: newTransaction
    })
}

async function createIntialFundsTransaction(req,res){
    const {toAccount,amount,idempotencyKey}= req.body;
    if(!toAccount||!amount||!idempotencyKey){
        return res.status(400).json({
            message:"toAccount,amount,idempotencykey is required"
        })
    }
    const toUserAccount= await accountModel.findById(toAccount);
    if(!toUserAccount){
        return res.status(400).json({
            message:"Invalid to Account"
        })
    }
    const fromUserAccount = await userModel.findOne({
        systemUser: true,
        _id: req.user._id

    })
    if(!fromUserAccount){
        return res.status(400).json({
            message:"System user account not found"
        })
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    const transaction = await transactionModel.create({
        from: fromUserAccount._id,
        to: toAccount,
        amount,idempotencyKey,
        status:"PENDING"
    });
await transaction.save({session:session});
    const debitLedgerEntry = await ledgerModel.create([{
        account: fromUserAccount._id,
        amount:amount,
        transaction: transaction._id,
        type:"DEBIT"
    }],{session});
    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount,
        amount:amount,
        transaction: transaction._id,
        type:"CREDIT"
    }],{session});
    transaction.status="COMPLETED"
    await transaction.save({session});
    await session.commitTransaction();
    session.endSession();
    return res.status(201).json({
        message:"Intial funds transaction Completed",
        transaction: transaction
    })
}

module.exports={
    createTransaction,
    createIntialFundsTransaction
}