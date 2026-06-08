const express = require("express");
const { protect, authorizeRoles } = require("../middleware/auth.middleware");
const { getCompanyDashboardStats } = require("../controllers/dashboard.controller");

const router = express.Router();

// GET /api/v1/dashboard/company/stats
router.get(
  "/company/stats",
  protect,
  authorizeRoles("COMPANY"),
  getCompanyDashboardStats
);

module.exports = router;
