const express = require("express");
const { getCandidateDashboard, getCompanyDashboard, getCompanyAnalytics } = require("../controllers/dashboard.controller");
const { protect: authMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/candidate", authMiddleware, getCandidateDashboard);
router.get("/company", authMiddleware, getCompanyDashboard);
router.get("/company/analytics", authMiddleware, getCompanyAnalytics);

module.exports = router;
