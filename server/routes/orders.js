const express = require("express");
const Order = require("../models/Order");
const authenticate = require("../middleware/auth");

const router = express.Router();

// POST /api/orders - Create new order (protected)
router.post("/", authenticate, async (req, res) => {
  try {
    const { items, total, shippingAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!total || total <= 0) {
      return res.status(400).json({ message: "Invalid total" });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    const { name, street, city, state, zipCode, country } = shippingAddress;
    if (!name || !street || !city || !state || !zipCode || !country) {
      return res
        .status(400)
        .json({ message: "All shipping fields are required" });
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      total,
      shippingAddress,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/orders - Get user's orders (protected)
router.get("/", authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.product", "name image");
    res.json(orders);
  } catch (err) {
    console.error("Error getting orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/orders/:id - Get single order (protected)
router.get("/:id", authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.product",
      "name image"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (err) {
    console.error("Error getting order:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
