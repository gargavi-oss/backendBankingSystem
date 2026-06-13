const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    from:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true,"account must be specified for transaction"],
        index: true
    },
    to:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true,"Account must be specified for transaction"],
        index: true
    },
    amount:{
        type: Number,
        required:[true,"Amount must be specified"],
        min:[0,"Transaction cannot be negative"]
    },
    status:{
        type: String,
        enum:{
            values:["PENDING","COMPLETED","REVERSED","FAILED"],
            messgae:"Status can either be PENDING, COMPLETED,REVERSED or FAILED"
        },
        default: "PENDING"
    },
    idempotencyKey:{
        type: String,
        required: [true,"Idempotency Key is required"],
        index: true,
        unique: true
    }
},{
    timestamps: true
});

const transactionModel = mongoose.model("transaction",transactionSchema);

module.exports = transactionModel;