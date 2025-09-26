const express = require("express");
const { createReview, getReviewsByProduct, deleteReview } = require("../controllers/reviewController");
const isAuthenticated = require("../middleware/authMiddleware"); // Assuming authentication middleware

const router = express.Router();

router.post("/", isAuthenticated, createReview);
router.get("/:productId", getReviewsByProduct);
router.delete("/:id", isAuthenticated, deleteReview);

module.exports = router;
