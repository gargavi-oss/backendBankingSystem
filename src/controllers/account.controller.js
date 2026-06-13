const accountModel = require("../models/account.model.js");

async function createAccountController(req,res){
    const user = req.user;
    const {currency} = req.body;
    const accountExists = await accountModel.findOne({
        user
    });
    if(accountExists){
        return res.status(401).json({
            message: "Account already exists with the user"
        })
    }
    const account = await accountModel.create({
        user: user._id,
        userName: user.name,
        currency: currency
    });
    if(!account){
        return res.status(402).json({
            message:"Error while creating the account has occured"
        })
    }
    res.status(201).json({
        account
    })
}

async function getUserAccountsInfo(req,res){
    const user = req.user;
    const account = await accountModel.find({user:user._id});
    res.status(200).json({
        account
    })
}
async function getAccountBalance(req,res){
    const {accountId}= req.params;
    const user = req.user;
    const account = await accountModel.findOne({
        _id: accountId,
        user:user._id
    })
    if(!account){
        return res.status(404).json({
            message:"Account not found"
        })
    }
    const balance = await account.getBalance();
    return res.status(200).json({
        accountId:account._id,
        balance:balance
    })
}


module.exports = {createAccountController,getUserAccountsInfo,getAccountBalance}