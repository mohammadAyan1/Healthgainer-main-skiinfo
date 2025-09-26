const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  variantId: { type: mongoose.Schema.Types.ObjectId, required: false }, // Stores selected variant
  name: { type: String, required: false }, // Product Name
  weight: { type: String, required: false }, // Variant weight
  price: { type: Number, required: false }, // Discounted price of the variant
  mrp: { type: Number, required: false }, // Original price
  discount: { type: Number, default: 0 }, // Discount in percentage
  quantity: { type: Number, required: false, default: 1 },
  subtotal: { type: Number, required: false }, // price * quantity
  images: [{ type: String, required: false }], // Variant images
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: false,
    }, // Reference to User
    guestId: { type: String },
    items: [cartItemSchema], // Array of products in the cart
    totalAmount: { type: Number, required: false, default: 0 }, // Total cart value
    totalItems: { type: Number, required: false, default: 0 }, // Total number of unique items
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Middleware to calculate total price & items before saving
cartSchema.pre("save", function (next) {
  this.totalItems = this.items.length;
  this.totalAmount = this.items.reduce((acc, item) => acc + item.subtotal, 0);
  this.updatedAt = Date.now();
  next();
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
