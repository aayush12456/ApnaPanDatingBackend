const mongoose = require("mongoose");

const notifySchema = mongoose.Schema({
    loginId:{
        type:String
    },
    notifyToken:{
        type:String
    },
    timestamp: { 
        type: Date, 
        required: true, 
        default: Date.now  // Automatically sets the timestamp to the current time
    }
})
// notifySchema.index({ timestamp: 1 }, { expireAfterSeconds:43200 });
const notifyIdDataUser = new mongoose.model("notifyIdUser", notifySchema);
module.exports = notifyIdDataUser;