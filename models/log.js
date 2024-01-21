const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    assigned:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    date:{
        type:String
    },
    time:{
        type:String
    },
    right:{
        type:Number,
    },
    wrong:{
        type:Number
    }
})

const Log = new mongoose.model('log',logSchema)

module.exports = Log;