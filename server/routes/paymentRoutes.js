const express = require("express");
const router = express.Router();
const {
  createPaymentOrder,
  handlePaymentVerify,
} = require("../controllers/paymentController");

const isAuthenticated = require("../middleware/authMiddleware");

router.post("/order", isAuthenticated, createPaymentOrder);
router.post("/verify", isAuthenticated, handlePaymentVerify);

module.exports = router;
