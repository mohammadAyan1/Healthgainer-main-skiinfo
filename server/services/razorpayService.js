const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async ({ amount, currency = "INR", receipt }) => {
  const options = {
    amount: amount * 100, // Razorpay expects paise
    currency,
    receipt: receipt || `rcptid_${Math.floor(Math.random() * 10000)}`,
  };

  return await razorpayInstance.orders.create(options);
};

exports.verifyPayment = ({ order_id, payment_id, signature }) => {
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${order_id}|${payment_id}`)
    .digest("hex");

  return generatedSignature === signature;
};
