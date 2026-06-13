const transactionModel = require("../models/transaction.model.js");
const ledgerModel= require("../models/ledger.model.js");
const accountModel = require("../models/account.model.js");
const emailService = require("../services/email.js");
const authMiddleware = require('../middlewares/auth.middleware.js');

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
    if(fromUserAccount.status!=="ACTIVE"||toUserAccount.status!=="Active"){
        return res.status(500).json({
            message: "Both fromAccount and toAccount must be Active to process transaction"
        })
    }
    const balance = await fromUserAccount.getBalance()



}

