const express = require("express");
const {
  getPlatformStats,
  getAllUsers,
  getAllJobs,
  getAllApplications,
  updateUserStatus,
} = require("../controllers/admin.controller");
const { protect: authMiddleware, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

// Private routes (authenticated - Admin only)
router.get("/stats", authMiddleware, authorizeRoles("ADMIN"), getPlatformStats);
router.get("/users", authMiddleware, authorizeRoles("ADMIN"), getAllUsers);
router.get("/jobs", authMiddleware, authorizeRoles("ADMIN"), getAllJobs);
router.get("/applications", authMiddleware, authorizeRoles("ADMIN"), getAllApplications);
router.patch("/users/:id/status", authMiddleware, authorizeRoles("ADMIN"), updateUserStatus);

module.exports = router;
