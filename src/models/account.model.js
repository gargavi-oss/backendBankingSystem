const mongoose = require('mongoose');
const ledgerModel = require("./ledger.model.js");

const accountSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true,"Account must be associated with user"],
        index: true
    },
    userName: {
        type:String,
        required: true
    },
    status:{
        type: String,
        enum:{
            values: ['ACTIVE',"FROZEN","CLOSED"],
            message: "Status can be Active ,Frozen or Closed",
        },
        default: "ACTIVE"
    },
    currency:{
        type: String,
        required:[true,'Currency is required for creating an account'],
        default: "INR"
    }
},{
    timestamps:true
})

accountSchema.index({user:1,status:1})

accountSchema.methods.getBalance = async function(){
    const balanceData = await ledgerModel.aggregate([
        {$match:{account: this._id}},
        {
            $group:{
                _id: null,
                totalDebit:{
                    $sum:{
                        $cond:[
                            {$eq:["$type","DEBIT"]},
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredit:{
                    $sum:{
                        $cond:[
                            {$eq:["$type","CREDIT"]},
                            "$amount",
                            0
                        ]
                    }
            }
        }
    },
    {
        $project:{
            _id:0,
            balance:{$subtract: ["$totalCredit","$totalDebit"]}
        }
    }
    ])
    return balanceData.length>0 ?balanceData[0].balance:0
}

const accountModel = mongoose.model("account",accountSchema);

module.exports = accountModel;