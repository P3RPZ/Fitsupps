const express = require("express");
const Product = require("../models/productModel");
const Order = require("../models/Order");
const User = require("../models/User");
const authenticate = require("../middleware/auth");

const router = express.Router();

// All routes require admin authentication
router.use(authenticate);
router.use((req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
});

// ========== PRODUCT MANAGEMENT ==========

// GET /api/admin/products - Get all products (admin view)
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Error getting products:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/admin/products - Create new product
router.post("/products", async (req, res) => {
  try {
    const { name, image, price, category, description } = req.body;

    if (!name || !image || !price || !category || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (price <= 0) {
      return res.status(400).json({ message: "Price must be greater than 0" });
    }

    const product = await Product.create({
      name,
      image,
      price,
      category,
      description,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/admin/products/:id - Update product
router.put("/products/:id", async (req, res) => {
  try {
    const { name, image, price, category, description } = req.body;

    if (price !== undefined && price <= 0) {
      return res.status(400).json({ message: "Price must be greater than 0" });
    }

    // Only update fields that are provided
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (image !== undefined) updateData.image = image;
    if (price !== undefined) updateData.price = price;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("Error updating product:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/admin/products/:id - Delete product
router.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// ========== ORDER MANAGEMENT ==========

// GET /api/admin/orders - Get all orders
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("items.product", "name image");
    res.json(orders);
  } catch (err) {
    console.error("Error getting orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/admin/orders/:id - Get single order
router.get("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product", "name image");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("Error getting order:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid order ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/admin/orders/:id/status - Update order status
router.put("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("user", "name email")
      .populate("items.product", "name image");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("Error updating order status:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid order ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// ========== USER MANAGEMENT ==========

// GET /api/admin/users - Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("Error getting users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/admin/users/:id/admin - Toggle admin status
router.put("/users/:id/admin", async (req, res) => {
  try {
    const { isAdmin } = req.body;

    // Prevent removing admin status from yourself
    if (req.user._id.toString() === req.params.id && !isAdmin) {
      return res.status(400).json({ message: "Cannot remove admin status from yourself" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isAdmin },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error updating user:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/admin/stats - Get dashboard statistics
router.get("/stats", async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders, totalRevenue] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ]),
    ]);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email");

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders,
    });
  } catch (err) {
    console.error("Error getting stats:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

