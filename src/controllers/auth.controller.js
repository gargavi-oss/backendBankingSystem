const userModel = require("../models/user.model.js")
const jwt = require('jsonwebtoken');
const emailService= require("../services/email.js");
const tokenBlackListModel = require("../models/blackList.model.js");

const userRegsiterController= async (req,res)=>{
    const {email,name,password,systemUser}= req.body;
    const isExists = await userModel.findOne({
        email:email
    });
    if(isExists){
        return res.status(422).json({
            messgae: "User already exists with email.",
            status: "failed"
        })
    }
    const user = await userModel.create({
        email,password,name,systemUser
    })
    const token = jwt.sign({userId:user._id},process.env.JWT_TOKEN,{expiresIn:"3d"});
    res.cookie("token",token);
    
    res.status(201).json({
        user:{
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    })
    await emailService.sendRegsistrationEmail(user.email,user.name);

}

const userLoginController = async (req,res)=>{
    const {email,password}= req.body;
    const user = await userModel.findOne({
        email
    }).select("+password");
    if(!user){
        return res.status(401).json({
            messgae: "User doesn't exist",
            status: "failed"
        })
    }
    const isValidPassword = await user.comparePassword(password)
    if(!isValidPassword){
        return res.status(401).json({
            messgae: "Invalid Password",
            status: "failed"
        })
    }
    const token = jwt.sign({userId:user._id},process.env.JWT_TOKEN,{expiresIn:"3d"});
    res.cookie("token",token);
    console.log(user.email,user.name);
    emailService
    .sendLoginEmail(user.email, user.name)
    .catch(err => console.error("Email Error:", err));
    res.status(200).json({
        user:{
            id: user._id,
            email: user.email,
            name: user.name
        }, token
    })
    
}

async function userLogoutController(req,res){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ];
    if(!token){
        return res.status(200).json({
            message: "User logged out sucessfully" 
        })
    }
    res.clearCookie("token");
    await tokenBlackListModel.create({
        token: token
    })
    res.status(200).json({
        message: "User logged out sucessfully"
    })
}

module.exports= {
    userRegsiterController,
    userLoginController,
    userLogoutController
}