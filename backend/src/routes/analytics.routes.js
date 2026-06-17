const express = require("express");
const SiteVisit = require("../models/siteVisit.model");

const router = express.Router();

// POST /api/v1/analytics/visit - Log a site visit
router.post("/visit", async (req, res) => {
  try {
    const ipAddress = req.ip || req.headers["x-forwarded-for"] || "";
    const userAgent = req.headers["user-agent"] || "";

    // Avoid logging duplicate visits from the same IP within a short timeframe (1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const existing = await SiteVisit.findOne({
      ipAddress,
      createdAt: { $gte: oneHourAgo }
    });

    if (!existing) {
      await SiteVisit.create({ ipAddress, userAgent });
    }

    return res.status(200).json({ success: true, message: "Visit logged" });
  } catch (error) {
    console.error("Log Visit Error:", error.message);
    return res.status(500).json({ success: false, message: "Error logging visit" });
  }
});

module.exports = router;
