const mongoose = require("mongoose");

const credSchema = mongoose.Schema({
    zegoAppId:{
        type:String
    },
    zegoAppSign:{
    type:String
    },
    exprtChatApiKey:{
        type:String
    }
        
})
const credUploads = new mongoose.model("credentials", credSchema);
module.exports = credUploads;