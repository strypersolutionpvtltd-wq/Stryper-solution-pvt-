const express = require("express");
const { 
  registerUser, 
  loginUser, 
  getMe, 
  changePassword, 
  logoutUser, 
  deleteAccount,
  verifyEmail,
  resendOtp,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  sendSignupOtp,
  registerVerifiedUser
} = require("../controllers/auth.controller");
const { protect, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

// POST /api/v1/auth/send-signup-otp
router.post("/send-signup-otp", sendSignupOtp);

// POST /api/v1/auth/register-verified
router.post("/register-verified", registerVerifiedUser);

// POST /api/v1/auth/register
router.post("/register", registerUser);

// POST /api/v1/auth/login
router.post("/login", loginUser);

// POST /api/v1/auth/verify-email
router.post("/verify-email", verifyEmail);

// POST /api/v1/auth/resend-otp
router.post("/resend-otp", resendOtp);

// POST /api/v1/auth/forgot-password
router.post("/forgot-password", forgotPassword);

// POST /api/v1/auth/verify-reset-otp
router.post("/verify-reset-otp", verifyResetOtp);

// POST /api/v1/auth/reset-password
router.post("/reset-password", resetPassword);

// GET /api/v1/auth/me  (protected)
router.get("/me", protect, getMe);

// PUT /api/v1/auth/change-password  (protected)
router.put("/change-password", protect, changePassword);

// POST /api/v1/auth/logout  (protected)
// Frontend must delete the token after receiving the success response
router.post("/logout", protect, logoutUser);

// DELETE /api/v1/auth/delete-account  (protected)
// Requires current password in request body for confirmation
router.delete("/delete-account", protect, deleteAccount);

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
