const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Address = require("../models/addressModel");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const DealModel = require("../models/deal/DealModel");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1️⃣ Create Razorpay order only (do NOT save Mongo order yet)
exports.createPaymentOrder = async (req, res) => {
  try {
    const { addressId, note, type } = req.body;
    const { price } = req.body.items[0];

    const userId = req.id;
    let cart;
    if (type !== "viewPlan") {
      cart = await Cart.findOne({ userId }).populate({
        path: "items.productId",
        model: "Product",
      });

      if (!cart || cart.items.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Cart is empty!" });
      }
    }
    const address = await Address.findById(addressId);
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    // Calculate total amount
    let totalAmount = 0;
    if (type !== "viewPlan") {
      totalAmount = cart.items.reduce((acc, item) => {
        const product = item.productId;
        const price = item.variantId
          ? product.variants.find(
              (v) => v._id.toString() === item.variantId.toString()
            )?.price || product.price
          : product.price;
        return acc + item.quantity * price;
      }, 0);
    }

    // Create Razorpay order
    let razorpayOrder;
    if (type !== "viewPlan") {
      razorpayOrder = await razorpay.orders.create({
        amount: totalAmount * 100, // paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });
    } else {
      razorpayOrder = await razorpay.orders.create({
        amount: price * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });
    }

    res.status(200).json({
      success: true,
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
      },
    });
  } catch (err) {
    console.error("❌ createPaymentOrder Error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};

// 2️⃣ Verify payment & create MongoDB order AFTER success
exports.handlePaymentVerify = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      addressId,
      note,
      type,
      productSet,
    } = req.body;
    const userId = req.id;

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    // ✅ Payment is verified, now create order in MongoDB
    let cart;
    if (type != "viewPlan") {
      cart = await Cart.findOne({ userId }).populate({
        path: "items.productId",
        model: "Product",
      });
    }

    let deal = null;
    if (
      type === "viewPlan" &&
      req.body.productSet &&
      req.body.productSet.length > 0
    ) {
      deal = await DealModel.findOne({ _id: req.body.productSet[0].product });
    }

    const address = await Address.findById(addressId);

    let totalAmount;
    if (type !== "viewType") {
      totalAmount = cart?.items.reduce((acc, item) => {
        const product = item.productId;
        const price = item.variantId
          ? product.variants.find(
              (v) => v._id.toString() === item.variantId.toString()
            )?.price || product.price
          : product.price;
        return acc + item.quantity * price;
      }, 0);
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrderId = `HG${randomNum}`;
    const lastOrder = await Order.findOne().sort({ orderNumber: -1 });
    const newOrderNumber = lastOrder ? lastOrder.orderNumber + 1 : 101;

    let savedOrder;
    if (type !== "viewPlan") {
      savedOrder = await Order.create({
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        userId,
        items: cart.items.map((item) => {
          const product = item.productId;
          const price = item.variantId
            ? product.variants.find(
                (v) => v._id.toString() === item.variantId.toString()
              )?.price || product.price
            : product.price;
          return {
            productId: product._id,
            variantId: item.variantId || null,
            quantity: item.quantity,
            price,
          };
        }),
        totalAmount,
        address: {
          fullName: address.fullName,
          phone: address.phone,
          street: address.street,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          country: address.country,
        },
        note,
        type,
        paymentMethod: "Online",
        paymentStatus: "Paid",
        orderId: newOrderId,
        orderNumber: newOrderNumber,
      });
    } else {
      savedOrder = await Order.create({
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        userId,
        items: req.body.productSet.map((item) => ({
          dealOfTheDay: item.product,
          variantId: null,
          title: item.title, // save it
          subtitle: item.subtitle, // save it
          quantity: item.quantity,
          price: item.price,
        })),

        totalAmount: req.body.productSet[0]?.price,
        address: {
          fullName: address.fullName,
          phone: address.phone,
          street: address.street,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          country: address.country,
        },
        note,
        type,
        paymentMethod: "Online",
        paymentStatus: "Paid",
        orderId: newOrderId,
        orderNumber: newOrderNumber,
      });
    }

    // Clear user's cart
    if (type !== "viewplan") {
      await Cart.findOneAndUpdate({ userId }, { items: [] });
    }

    console.log(savedOrder);

    res.status(200).json({ success: true, orderId: savedOrder._id.toString() });
  } catch (err) {
    console.error("❌ handlePaymentVerify Error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};
