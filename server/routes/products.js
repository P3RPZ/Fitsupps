const express = require("express");
const Product = require("../models/productModel");
const authenticate = require("../middleware/auth");

const router = express.Router();

// GET /api/products - Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("Error getting products:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/products/:id - Get one product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error("Error getting product:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/products - Create a product (protected - requires auth)
router.post("/", authenticate, async (req, res) => {
  try {
    const { name, image, price, category, description } = req.body;

    if (!name || !image || !price || !category || !description) {
      return res.status(400).json({ message: "All fields are required" });
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

module.exports = router;
