const mongoose = require("mongoose");

const loginIdSchema = mongoose.Schema({
    loginId:{
        type:String
    },
    loginEmail:{
        type:String
    },
    timestamp: { 
        type: Date, 
        required: true, 
        default: Date.now  // Automatically sets the timestamp to the current time
    }
})
loginIdSchema.index({ timestamp: 1 }, { expireAfterSeconds:43200 });
const loginIdDataUser = new mongoose.model("loginIdUser", loginIdSchema);
module.exports = loginIdDataUser;