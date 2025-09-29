const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Address = require("../models/addressModel");

const crypto = require("crypto");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.placeOrder = async (req, res) => {
  const id = req.id; // user id from auth middleware
  const userId = id;

  try {
    const { addressId, note } = req.body;

    let cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      model: "Product",
    });

    if (!cart || cart.items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Cart is empty!" });
    }

    const address = await Address.findById(addressId);
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    // Calculate total
    let totalAmount = cart.items.reduce((acc, item) => {
      const product = item.productId;
      const variant = product.variants.find(
        (v) => v._id.toString() === item.variantId.toString()
      );
      if (!variant) {
        throw new Error(`Variant not found for product: ${product.name}`);
      }
      const price = variant.price || product.price;
      return acc + item.quantity * price;
    }, 0);

    // ✅ Create Razorpay Order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // 🔹 Generate custom OrderId + OrderNumber
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrderId = `HG${randomNum}`;

    const lastOrder = await Order.findOne().sort({ orderNumber: -1 });
    const newOrderNumber = lastOrder ? lastOrder.orderNumber + 1 : 101;

    // ✅ Save Order in DB with status Pending
    const order = new Order({
      orderId: newOrderId,
      orderNumber: newOrderNumber,
      userId,
      items: cart.items.map((item) => ({
        productId: item.productId._id,
        variantId: item.variantId,
        quantity: item.quantity,
        price:
          item.productId.variants.find(
            (v) => v._id.toString() === item.variantId.toString()
          )?.price || item.productId.price,
      })),
      totalAmount,
      address: addressId,
      note,
      paymentMethod: "Online",
      paymentStatus: "Pending",
      razorpayOrderId: razorpayOrder.id,
    });

    await order.save();

    

    // ✅ Return Razorpay order details to frontend
    res.status(201).json({
      success: true,
      razorpayOrder,
      orderId: order._id,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrders = async (req, res) => {
  const id = req.id;
  const userId = id;
  try {
    
    const orders = await Order.find({ userId })
      .populate("address") // Address details populate karein
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

   
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Update Order Status
    order.status = status;

    // If order is delivered and payment method is COD, mark payment as paid
    if (status === "Delivered") {
      order.paymentStatus = "Paid";
    }

    await order.save();
    res.status(200).json({
      success: true,
      message: "Order status updated successfully!",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Order deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 }) // Sorting by newest first
      .populate("address")
      .populate({
        path: "items.productId",
        populate: {
          path: "variants",
          model: "Product",
        },
      })
      .populate("userId");

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, paymentStatus } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    order.status = status;
    order.paymentStatus = paymentStatus;

    await order.save();

    res
      .status(200)
      .json({ success: true, message: "Order updated successfully!", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.totalRevenu = async (req, res) => {
  try {
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    if (totalRevenue.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found" });
    }

    res
      .status(200)
      .json({ success: true, totalRevenue: totalRevenue[0].total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.monthlyRevenu = async (req, res) => {
  try {
    const monthlyRevenue = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } }, // Sort by month
    ]);

    // Helper function to format revenue
    const formatAmount = (amount) => {
      if (amount >= 10000000) {
        return (amount / 10000000).toFixed(2) + " Cr";
      } else if (amount >= 100000) {
        return (amount / 100000).toFixed(2) + " Lakh";
      } else if (amount >= 1000) {
        return (amount / 1000).toFixed(1) + "K";
      }
      return amount.toString();
    };

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formattedRevenue = monthlyRevenue.map((data) => ({
      month: months[data._id - 1], // Convert _id (1-12) to month name
      total: formatAmount(data.total), // Format total amount
    }));

    res.status(200).json({ success: true, monthlyRevenue: formattedRevenue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }); // Newest orders first

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.newOrderNotifications = (req, res) => {
  

  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    
    const connectionType =
      mongoose.connection?.db?.topology?.s?.descriptionType;

    if (connectionType !== "ReplicaSetWithPrimary") {
      console.warn(
        "⚠️ [SSE] Change streams require a replica set. Skipping stream."
      );
      res.write(
        `data: ${JSON.stringify({
          error: "Change stream not supported on this DB.",
        })}\n\n`
      );
      return;
    }

    const changeStream = Order.watch();

    changeStream.on("change", (change) => {
      

      if (change.operationType === "insert") {
        const newOrder = change.fullDocument;
        

        try {
          res.write(`data: ${JSON.stringify(newOrder)}\n\n`);
          
        } catch (err) {
          console.error("❌ [SSE] Error writing data to client:", err);
        }
      }
    });

    // Har 25 sec me keep-alive ping bhejo
    const keepAliveInterval = setInterval(() => {
      
      try {
        res.write("data: {}\n\n");
      } catch (err) {
        console.error("❌ [SSE] Error sending keep-alive ping:", err);
      }
    }, 25000);

    // Client disconnect handle karein
    req.on("close", () => {
      
      clearInterval(keepAliveInterval);
      changeStream
        .close()
        .then(() => {
          
        })
        .catch((err) => {
          console.error("❌ [SSE] Error closing change stream:", err);
        });
    });
  } catch (err) {
    console.error("❌ [SSE] Error in newOrderNotifications handler:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
