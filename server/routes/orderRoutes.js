const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/authMiddleware");
const { 
    placeOrder, 
    getOrders, 
    updateOrderStatus, 
    getAllOrders, 
    totalRevenu,
    getOrderById,
    monthlyRevenu,
    getOrdersByUser,
    newOrderNotifications
} = require("../controllers/orderController");

// ✅ Place Order
router.post("/place", isAuthenticated, placeOrder);

// ✅ Get All Orders (Admin)
router.get("/all", isAuthenticated, getAllOrders);

// ✅ Get Total Revenue (Admin)
router.get("/revenu", isAuthenticated, totalRevenu);

// ✅ Get Monthly Revenue (Admin)
router.get("/monthly-revenu", isAuthenticated, monthlyRevenu);

// ✅ Get New Order Notifications (Admin)
router.get("/notifications", newOrderNotifications);

// ✅ Get Orders for a Specific User (User Panel)
router.get("/user/:userId", isAuthenticated, getOrdersByUser);

// ✅ Get Order by ID
router.get("/:orderId", isAuthenticated, getOrderById);

// ✅ Get Orders for Logged-in User
router.get("/", isAuthenticated, getOrders);

// ✅ Update Order Status (Admin)
router.put("/update", isAuthenticated, updateOrderStatus);

module.exports = router;
