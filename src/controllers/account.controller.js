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



module.exports = {createAccountController}