const transactionModel = require("../models/transaction.model.js");
const ledgerModel= require("../models/ledger.model.js");
const accountModel = require("../models/account.model.js");
const emailService = require("../services/email.js");
const authMiddleware = require('../middlewares/auth.middleware.js');

async function createTransaction(req,res){
    const {fromAccount,toAccount,idempotencyKey,amount}= req.body;
    if(!fromAccount || !toAccount||!amount|| !idempotencyKey){
        res.status(400).json({
            message: "Data is missing for transaction"
        });
    }

}

