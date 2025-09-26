// // import Order from "../models/orderModel.js";
// const Order = require("../models/orderModel.js");
// const Cart = require("../models/cartModel");
// const Address = require("../models/addressModel");
// const Razorpay = require("razorpay");
// const crypto = require("crypto");

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // exports.createPaymentOrder = async (req, res) => {
// //   try {
// //     const { amount, items, addressId, note } = req.body;

// //     const id = req.id; // user id from auth middleware
// //     const userId = id;
// //     // console.log("💰 Received amount from frontend:", userId);

// //     if (!items || !items.length) {
// //       return res.status(400).json({ error: "Items are required" });
// //     }

// //     if (!amount || isNaN(amount)) {
// //       return res
// //         .status(400)
// //         .json({ error: "Amount is required and must be a number" });
// //     }

// //     const options = {
// //       amount: amount * 100, // paise
// //       currency: "INR",
// //       receipt: `rcpt_${Date.now()}`,
// //     };

// //     // console.log("📦 Creating Razorpay order with:", options);

// //     const order = await razorpay.orders.create(options);
// //     // console.log("✅ Razorpay order created:", order);

// //     // Save to MongoDB using your Order model
// //     const savedOrder = await Order.create({
// //       razorpayOrderId: order.id,
// //       amount: order.amount,
// //       currency: order.currency,
// //       receipt: order.receipt,
// //       // status: "Pending", // ✅ Valid enum value
// //       userId: userId,
// //       items,
// //       address: addressId,
// //       totalAmount: amount,
// //       note,
// //     });

// //     console.log("🗃️ Order saved to DB:", savedOrder);

// //     res.status(200).json({
// //       success: true,
// //       order: {
// //         id: order.id,
// //         mongoOrderId: savedOrder._id.toString(),
// //         amount: order.amount,
// //         currency: order.currency,
// //         receipt: order.receipt,
// //         status: order.status,
// //         created_at: order.created_at,
// //       },
// //       key: process.env.RAZORPAY_KEY_ID,
// //     });
// //   } catch (err) {
// //     console.error("❌ Error in createPaymentOrder:", err);
// //     res.status(500).json({ error: err.message || "Internal server error" });
// //   }
// // };

// exports.createPaymentOrder = async (req, res) => {
//   try {
//     const { addressId, note , type} = req.body;

//     const userId = req.id; // 🟢 userId from auth middleware

//     // ✅ Get Cart
//     let cart = await Cart.findOne({ userId }).populate({
//       path: "items.productId",
//       model: "Product",
//     });

//     if (!cart || cart.items.length === 0) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Cart is empty!" });
//     }

//     // ✅ Check Address
//     const address = await Address.findById(addressId);
//     if (!address) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Address not found" });
//     }

//     // ✅ Trusted server-side sum
//     let totalAmount = cart.items.reduce((acc, item) => {
//       const product = item.productId;
//       const variant = product.variants.find(
//         (v) => v._id.toString() === item.variantId.toString()
//       );
//       if (!variant) {
//         throw new Error(`Variant not found for product: ${product.name}`);
//       }
//       const price = variant.price || product.price;
//       return acc + item.quantity * price;
//     }, 0);

//     // ✅ Create Razorpay Order
//     const razorpayOrder = await razorpay.orders.create({
//       amount: totalAmount * 100, // paise
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,
//     });

//     // ✅ Generate custom OrderId + OrderNumber
//     const randomNum = Math.floor(1000 + Math.random() * 9000);
//     const newOrderId = `HG${randomNum}`;

//     const lastOrder = await Order.findOne().sort({ orderNumber: -1 });
//     const newOrderNumber = lastOrder ? lastOrder.orderNumber + 1 : 101;

//     // ✅ Save Order in DB with all details
//     const savedOrder = await Order.create({
//       razorpayOrderId: razorpayOrder.id,
//       userId,
//       items: cart.items.map((item) => ({
//         productId: item.productId._id,
//         variantId: item.variantId,
//         quantity: item.quantity,
//         price:
//           item.productId.variants.find(
//             (v) => v._id.toString() === item.variantId.toString()
//           )?.price || item.productId.price,
//       })),
//       totalAmount,
//       address: {
//         fullName: address.fullName,
//         phone: address.phone,
//         street: address.street,
//         city: address.city,
//         state: address.state,
//         zipCode: address.zipCode,
//         country: address.country,
//       },
//       note,
//       type,
//       paymentMethod: "Online",
//       paymentStatus: "Pending",
//       orderId: newOrderId,
//       orderNumber: newOrderNumber,
//     });

//     // ✅ Response with all needed data
//     res.status(200).json({
//       success: true,
//       order: {
//         id: razorpayOrder.id,
//         mongoOrderId: savedOrder._id.toString(),
//         amount: razorpayOrder.amount,
//         currency: razorpayOrder.currency,
//         receipt: razorpayOrder.receipt,
//         status: razorpayOrder.status,
//         created_at: razorpayOrder.created_at,
//         orderId: savedOrder.orderId, // 🆗 Custom OrderId
//         orderNumber: savedOrder.orderNumber, // 🆗 OrderNumber
//       },
//       key: process.env.RAZORPAY_KEY_ID,
//     });
//   } catch (err) {
//     console.error("❌ Error in createPaymentOrder:", err);
//     res.status(500).json({ error: err.message || "Internal server error" });
//   }
// };

// exports.handlePaymentVerify = async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
//       req.body;

//     const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
//     hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
//     const generatedSignature = hmac.digest("hex");

//     if (generatedSignature === razorpay_signature) {
//       // ✅ Update order in DB
//       await Order.findOneAndUpdate(
//         { razorpayOrderId: razorpay_order_id },
//         {
//           razorpayPaymentId: razorpay_payment_id,
//           razorpaySignature: razorpay_signature,
//           paymentStatus: "Paid",
//         }
//       );

//       return res.status(200).json({ success: true });
//     } else {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid signature" });
//     }
//   } catch (err) {
//     console.error("Verify Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };


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
      return res.status(400).json({ success: false, message: "Cart is empty!" });
    }

    // Check address
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

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
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.error("Verify Error:", err);
    res.status(500).json({ error: err.message });
  }
};
