const express = require("express");
const { registerUser, loginUser, getMe, changePassword } = require("../controllers/auth.controller");
const { protect, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

// POST /api/v1/auth/register
router.post("/register", registerUser);

// POST /api/v1/auth/login
router.post("/login", loginUser);

// GET /api/v1/auth/me  (protected)
router.get("/me", protect, getMe);

// PUT /api/v1/auth/change-password
router.put("/change-password", protect, changePassword);

// --- Role-based test routes ---

// GET /api/v1/auth/company-only
router.get("/company-only", protect, authorizeRoles("COMPANY"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome, Company! You have access to this route.",
    user: req.user,
  });
});

// GET /api/v1/auth/candidate-only
router.get("/candidate-only", protect, authorizeRoles("CANDIDATE"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome, Candidate! You have access to this route.",
    user: req.user,
  });
});

// GET /api/v1/auth/admin-only
router.get("/admin-only", protect, authorizeRoles("ADMIN"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome, Admin! You have access to this route.",
    user: req.user,
  });
});

module.exports = router;
