
const mongoose = require("mongoose");
const {Schema}=mongoose
const chatSchema = mongoose.Schema({
    loginId:{
        type:String
    },
    senderId:{
    type:String
    },
    recieverId:{
        type:String
    },
    message:{
        type:String
    },
 
    chatId: {
      type:String
      },
    //   timestamp: { type: String, required: true } 
    timestamp: { 
        type: Date, 
        required: true, 
        default: Date.now  // Automatically sets the timestamp to the current time
    }
})
chatSchema.index({ timestamp: 1 }, { expireAfterSeconds: 300 });
const chatUploads = new mongoose.model("chatUser", chatSchema);
module.exports = chatUploads;