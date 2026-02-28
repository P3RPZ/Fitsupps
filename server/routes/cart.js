const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/productModel");
const authenticate = require("../middleware/auth");

const router = express.Router();

// GET /api/cart - Get user's cart (protected)
router.get("/", authenticate, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart) {
      // Create empty cart if doesn't exist
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json(cart);
  } catch (err) {
    console.error("Error getting cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/cart - Add/update item in cart (protected)
router.post("/", authenticate, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity: quantity || 1 }],
      });
    } else {
      const existingItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (existingItemIndex >= 0) {
        // Update quantity
        cart.items[existingItemIndex].quantity += quantity || 1;
      } else {
        // Add new item
        cart.items.push({ product: productId, quantity: quantity || 1 });
      }

      await cart.save();
    }

    await cart.populate("items.product");
    res.json(cart);
  } catch (err) {
    console.error("Error updating cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/cart - Update cart item quantity (protected)
router.put("/", authenticate, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res
        .status(400)
        .json({ message: "Product ID and quantity are required" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    if (quantity <= 0) {
      // Remove item
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    await cart.populate("items.product");
    res.json(cart);
  } catch (err) {
    console.error("Error updating cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/cart/item/:productId - Remove item from cart (protected)
router.delete("/item/:productId", authenticate, async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate("items.product");
    res.json(cart);
  } catch (err) {
    console.error("Error removing item from cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/cart - Clear entire cart (protected)
router.delete("/", authenticate, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error("Error clearing cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
