// models/staffSchema.js
const mongoose = require("mongoose");

const accessSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
  },
   
  loginId: {
    type: String,
  },

  amount: {
    type: String,
  },
});

module.exports = mongoose.model("AccessSchema", accessSchema);