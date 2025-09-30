const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    amount: Number,
    currency: String,
    receipt: String,
    type: String,
    // status: { type: String, default: "created" },

    orderId: { type: String, unique: true }, // 🔹 Random ID (HG + 4-digit number)
    orderNumber: { type: Number, unique: true }, // 🔹 Sequential order number (101, 102, ...)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          // required: true,
        },
        dealOfTheDay: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Deal",
          // required: true,
        },
        title: String, // ✅ for deals
        subtitle: String, // ✅ for deals
        variantId: { type: mongoose.Schema.Types.ObjectId, required: false },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number },

    address: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    note: { type: String },
    paymentMethod: { type: String, enum: ["COD", "Online"] },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
