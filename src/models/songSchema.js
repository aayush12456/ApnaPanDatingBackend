const mongoose = require("mongoose");
const validator = require("validator");
const {Schema}=mongoose
const songSchema = mongoose.Schema({
    songName:{
        type:String
    },
    songImage:{
    type:String
    },
    songUrl:{
        type:String
    }
})
const songUploads = new mongoose.model("songUploadData", songSchema);
// const registerUser = new mongoose.model("ApnaPanUserDatas", authSchema);
module.exports = songUploads;