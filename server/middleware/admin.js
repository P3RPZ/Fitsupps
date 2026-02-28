const authenticate = require("./auth");

// Middleware to check if user is admin
// This should be used after authenticate middleware
const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

// Combined middleware: authenticate + admin check
const requireAdmin = [authenticate, isAdmin];

module.exports = isAdmin;
module.exports.requireAdmin = requireAdmin;

