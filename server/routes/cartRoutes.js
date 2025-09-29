const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const isAuthenticated = require("../middleware/authMiddleware");

// ✅ Get user's cart
router.get("/", cartController.getCart);

// ✅ Add item to cart
router.post("/add", cartController.addToCart);

// ✅ Remove item from cart
router.post("/remove", cartController.removeFromCart);

// ✅ Update item quantity in cart
router.post("/update", cartController.updateCartItemQuantity);

// EMpty all the card
router.post("/empty", cartController.emptyCart);
//update guest cart to user cart
router.put("/updateguestidtouserid", cartController.updateCartGuestIdToUserId);



module.exports = router;
