const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  verified: Boolean,
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
