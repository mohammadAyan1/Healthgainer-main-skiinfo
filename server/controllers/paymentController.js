const Order = require("../models/orderModel.js");
const Cart = require("../models/cartModel");
const Address = require("../models/addressModel");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createPaymentOrder = async (req, res) => {
  try {
    const { addressId, note, type } = req.body;
    const userId = req.id; // userId from auth middleware

    // Fetch cart and populate products
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      model: "Product",
    });

    if (!cart || cart.items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Cart is empty!" });
    }

    // Check address
    const address = await Address.findById(addressId);
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    // Calculate total amount
    const totalAmount = cart.items.reduce((acc, item) => {
      const product = item.productId;

      let price;
      if (item.variantId) {
        // Find variant if variantId exists
        const variant = product.variants.find(
          (v) => v._id.toString() === item.variantId.toString()
        );
        if (!variant) {
          throw new Error(`Variant not found for product: ${product.name}`);
        }
        price = variant.price || product.price;
      } else {
        price = product.price; // Fallback if no variant
      }

      return acc + item.quantity * price;
    }, 0);

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // Generate custom OrderId + OrderNumber
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrderId = `HG${randomNum}`;
    const lastOrder = await Order.findOne().sort({ orderNumber: -1 });
    const newOrderNumber = lastOrder ? lastOrder.orderNumber + 1 : 101;

    // Save order to DB
    const savedOrder = await Order.create({
      razorpayOrderId: razorpayOrder.id,
      userId,
      items: cart.items.map((item) => {
        const product = item.productId;
        let price;
        if (item.variantId) {
          const variant = product.variants.find(
            (v) => v._id.toString() === item.variantId.toString()
          );
          price = variant?.price || product.price;
        } else {
          price = product.price;
        }
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
      paymentStatus: "Pending",
      orderId: newOrderId,
      orderNumber: newOrderNumber,
    });

    // Send response
    res.status(200).json({
      success: true,
      order: {
        id: razorpayOrder.id,
        mongoOrderId: savedOrder._id.toString(),
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
        status: razorpayOrder.status,
        created_at: razorpayOrder.created_at,
        orderId: savedOrder.orderId,
        orderNumber: savedOrder.orderNumber,
      },
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("❌ Error in createPaymentOrder:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};

exports.handlePaymentVerify = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === razorpay_signature) {
      // Update order in DB
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          paymentStatus: "Paid",
        }
      );

      return res.status(200).json({ success: true });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.error("Verify Error:", err);
    res.status(500).json({ error: err.message });
  }
};
