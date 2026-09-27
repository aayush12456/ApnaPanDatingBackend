const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    loginId: {
      type: String,
      ref: "UserData",   // 🔥 same as your model name
      required: true,
      index: true
    },

    razorpaySubId: {
      type: String,
      required: true,
      // unique: true
    },

    planId: {
      type: String,
      required: true
    },
    amount: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: [
        "created",
        "authenticated",
        "active",
        "pending",
        "halted",
        "cancelled",
        "expired",
        "completed"
      ],
      default: "created"
    },

    startDate: {
      type: Date
    },

    endDate: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);