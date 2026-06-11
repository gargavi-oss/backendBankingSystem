const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required:[true,"Email is required"],
        trim:true,
        lowercase:true,
        unique: [true,"Email already exists"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    name:{
        type: String,
        required:[true,"Name of user is required"]
    },
    password:{
        type: String,
        required: [true,'Paswword of the account is required'],
        minlenght:[6,"Password should contain more than 6 characters"],
        select: false
    }
},{
    timestamps: true
})

userSchema.pre("save",async function(){
    if(!this.isModified("password")){
        return;
    }
    const hash = await bcrypt.hash(this.password,10);
    this.password= hash;
    return;
})

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
}

const userModel = mongoose.model("user",userSchema);

module.exports = userModel;