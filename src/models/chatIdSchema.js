const mongoose = require("mongoose");

const chatIdSchema = mongoose.Schema({
    loginId:{
        type:String
    },
    anotherId:{
    type:String
    },
    loginName:{
        type:String
    },
    anotherName:{
        type:String
    },
        
})
const chatIdUploads = new mongoose.model("chatIdUser", chatIdSchema);
module.exports = chatIdUploads;