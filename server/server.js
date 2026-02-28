const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const { runChat } = require("./langchainChat");

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/admin", require("./routes/admin"));

// Chatbot route
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res
        .status(400)
        .json({ error: "Request body must include a 'message' string." });
    }

    const answer = await runChat(message);
    return res.json({ answer });
  } catch (error) {
    console.error("Chatbot error:", error);

    const status =
      error?.status ??
      error?.statusCode ??
      error?.cause?.status ??
      error?.cause?.statusCode ??
      500;

    const safeStatus =
      typeof status === "number" && status >= 400 && status <= 599
        ? status
        : 500;

    return res.status(safeStatus).json({
      error: "Chatbot error",
      details:
        process.env.NODE_ENV === "production"
          ? undefined
          : error && error.message
            ? error.message
            : String(error),
    });
  }
});

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "FitSupps API is running",
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to FitSupps API",
    version: "1.0.0",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
