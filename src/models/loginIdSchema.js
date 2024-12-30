const mongoose = require("mongoose");

const loginIdSchema = mongoose.Schema({
    loginId:{
        type:String
    },
    loginEmail:{
        type:String
    }
})
const loginIdDataUser = new mongoose.model("loginIdUser", loginIdSchema);
module.exports = loginIdDataUser;