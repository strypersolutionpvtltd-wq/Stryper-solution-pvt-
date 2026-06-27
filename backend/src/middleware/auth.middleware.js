const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log(`[AUTH] Checking token for route: ${req.method} ${req.originalUrl}`);
    console.log(`[AUTH] Auth header:`, authHeader ? `${authHeader.slice(0, 20)}...` : "None");

    // 1. Check header exists and has correct Bearer format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.warn(`[AUTH] Rejected: No token or invalid Bearer format for ${req.originalUrl}`);
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      console.warn(`[AUTH] Rejected: Token missing from header for ${req.originalUrl}`);
      return res.status(401).json({
        success: false,
        message: "Access denied. Token missing.",
      });
    }

    // 3. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtErr) {
      console.error(`[AUTH] JWT verify failed for ${req.originalUrl}:`, jwtErr.message);
      throw jwtErr;
    }

    // 4. Check if user still exists and is not suspended
    const user = await User.findById(decoded.id).select("accountStatus role");

    if (!user) {
      console.warn(`[AUTH] Rejected: User ID ${decoded.id} no longer exists in database`);
      return res.status(401).json({
        success: false,
        message: "User no longer exists. Please login again.",
      });
    }

    if (user.accountStatus === "Suspended") {
      console.warn(`[AUTH] Rejected: User ${user.email || decoded.id} is suspended`);
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended. Please contact admin.",
      });
    }

    // 5. Attach decoded payload to request
    req.user = decoded; // { id, role, iat, exp }
    console.log(`[AUTH] Successfully authenticated user: ${decoded.id} (Role: ${decoded.role})`);

    next();
  } catch (error) {
    console.error(`[AUTH] Authentication exception:`, error.message);
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
