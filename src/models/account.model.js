const mongoose = require('mongoose');


const accountSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true,"Account must be associated with user"]
    },
    status:{
        enum:{
            values:["active","inactive"]
        }
    }

})