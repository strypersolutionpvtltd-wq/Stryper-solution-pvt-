const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check header exists and has correct Bearer format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token missing.",
      });
    }

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Check if user still exists and is not suspended
    //    This catches cases where admin suspended the user after they logged in
    const user = await User.findById(decoded.id).select("accountStatus role");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists. Please login again.",
      });
    }

    if (user.accountStatus === "Suspended") {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended. Please contact admin.",
      });
    }

    // 5. Attach decoded payload to request
    req.user = decoded; // { id, role, iat, exp }

    next();
  } catch (error) {
    // Handle specific JWT errors without leaking internals
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please login again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Authentication failed.",
    });
  }
};

// Authorize specific roles — always use AFTER protect middleware
// Usage: authorizeRoles("ADMIN", "COMPANY")
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // req.user is guaranteed to exist here (set by protect)
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Role not found.",
      });
    }

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This route is restricted to: ${roles.join(", ")}.`,
      });
    }

    next();
  };
};

module.exports = { protect, authorizeRoles };
