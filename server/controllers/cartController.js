const Cart = require("../models/cartModel");
const Product = require("../models/Product");
const { v4: uuidv4 } = require("uuid");

exports.addToCart = async (req, res) => {
  try {
    const { userId, guestId, productId, variantId, quantity } = req.body;
    console.log(req.body);

    const product = await Product.findById(productId);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    let variant;
    if (variantId) {
      variant = product.variants.find((v) => v._id.toString() === variantId);
      if (!variant)
        return res
          .status(404)
          .json({ success: false, message: "Variant not found" });
    } else {
      variant = {
        _id: product._id,
        price: product.price,
        mrp: product.mrp,
        discount: product.discount || 0,
        weight: product.weight || "",
        images: product.images || [],
      };
    }

    const price = variant.mrp - (variant.mrp * variant.discount) / 100;
    const subtotal = price * quantity;

    let cart = await Cart.findOne({
      $or: [{ userId: userId }, { guestId: guestId }],
    });

    if (userId) {
      cart = await Cart.findOne({userId})
    }else{
      cart = await Cart.findOne({guestId})
    }
    if (!cart) cart = new Cart({ userId, guestId, items: [] });

    // Check if same product (variantId or productId if variantId missing)
    const itemIndex = cart.items.findIndex((item) =>
      variantId
        ? item.variantId?.toString() === variantId
        : item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].subtotal =
        cart.items[itemIndex].price * cart.items[itemIndex].quantity;
    } else {
      cart.items.push({
        productId,
        variantId,
        name: product.name,
        weight: variant.weight,
        price,
        mrp: variant.mrp,
        discount: variant.discount,
        quantity,
        subtotal,
        images: variant.images,
      });
    }

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    // Filter out the item by _id
    const initialLength = cart.items.length;
    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

    if (cart.items.length === initialLength) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }

    await cart.save();
    res
      .status(200)
      .json({ success: true, message: "Item removed from cart", cart });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.updateCartItemQuantity = async (req, res) => {
  try {
    const { userId, itemId, quantity } = req.body;

    console.log(req.body);

    let cart = await Cart.findOne({ userId });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    const item = cart.items.id(itemId); // ✅ Find by cart item _id
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });

    item.quantity = quantity;
    item.subtotal = item.price * quantity;

    await cart.save();
    res
      .status(200)
      .json({ success: true, message: "Cart updated successfully", cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getCart = async (req, res) => {
  try {
    const { userId } = req.query || req.body;
    console.log(userId);
    // console.log(guestId);

    let cart;

    if (typeof userId === "string" && userId?.startsWith("guest-")) {
      cart = await Cart.findOne({ guestId: userId }).populate(
        "items.productId"
      );
    } else {
      cart = await Cart.findOne({ userId }).populate("items.productId");
    }

    // const cart = await Cart.find({
    //   $or: [{ userId: userId }, { guestId: guestId }],
    // }).populate("items.productId");

    console.log(cart);

    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    res.status(200).json({ success: true, cart: cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.emptyCart = async (req, res) => {
  const { userId } = req.body;
  let cart = await Cart.findOne({ userId });
  if (!cart)
    return res.status(404).json({ success: false, message: "Cart not found" });
  cart.items = [];
  await cart.save();
  res.status(200).json({ success: true, cart });
};
