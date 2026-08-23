const mongoose = require("mongoose");
const reportSchema = mongoose.Schema({
    senderName:{
        type:String
    },
    senderEmail:{
    type:String
    },
    recieverName:{
        type:String
    },
    recieverEmail:{
        type:String
    },
    message:{
        type:String
    },
    imageUrl:{
        type:String
    },

    imagePublicId:{
        type:String
    },
})
const reportUploads = new mongoose.model("reportData", reportSchema);
module.exports = reportUploads;