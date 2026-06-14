const userModel= require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../models/blackList.model.js");

async function authMiddleware(req,res,next){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ];
    if(!token){
        return res.status(401).json({
            message: "Unauthorized acess,token is missing"
        })
    }
    const isBlacklisted = await tokenBlackListModel.findOne({token});
    if(isBlacklisted){
        return res.status(401).json({
            message:"Unauthorized acess,Token blacklisted"
        })
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_TOKEN)
        const user = await userModel.findById(decoded.userId);
        req.user = user; 
        return next();
        
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized acess,token is invalid"
        })
    }
}

async function authSystemUserMiddleware(req,res,next){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ];
    if(!token){
        return res.status(401).json({
            message: "Unauthorized acess,token is missing"
        })
    }
    const isBlacklisted = await tokenBlackListModel.findOne({token});
    if(isBlacklisted){
        return res.status(401).json({
            message:"Unauthorized acess,Token blacklisted"
        })
    }
    try {
        const decoded= jwt.verify(token,process.env.JWT_TOKEN);
        const user = await userModel.findById(decoded.userId).select("+systemUser");
        if(!user.systemUser){
            return res.status(403).json({
                message:"Forbidden acess, not a system user"
            })
        }
        req.user = user;
        return next();
    } catch (error) {
        return res.status(401).json({
            message:"Unauthorized acess, token is invalid"
        })
        
    }
}

module.exports = {authMiddleware,authSystemUserMiddleware}