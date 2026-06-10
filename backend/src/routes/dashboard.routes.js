const express = require("express");
const { getCandidateDashboard, getCompanyDashboard } = require("../controllers/dashboard.controller");
const { protect: authMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

// Private routes (authenticated)
router.get("/candidate", authMiddleware, getCandidateDashboard);
router.get("/company", authMiddleware, getCompanyDashboard);

module.exports = router;
