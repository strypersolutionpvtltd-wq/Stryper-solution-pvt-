const express = require("express");
const SiteVisit = require("../models/siteVisit.model");

const router = express.Router();

// POST /api/v1/analytics/visit - Log a site visit
router.post("/visit", async (req, res) => {
  try {
    // Get real visitor IP (X-Forwarded-For pehle check karo — behind Nginx/EC2)
    const forwarded = req.headers["x-forwarded-for"];
    const ipAddress = forwarded
      ? forwarded.split(",")[0].trim()
      : req.socket?.remoteAddress || req.ip || "";

    const userAgent = req.headers["user-agent"] || "";

    // Parse browser from userAgent
    const browser =
      /Edg\//.test(userAgent) ? "Edge" :
      /OPR\/|Opera/.test(userAgent) ? "Opera" :
      /Chrome\//.test(userAgent) ? "Chrome" :
      /Firefox\//.test(userAgent) ? "Firefox" :
      /Safari\//.test(userAgent) ? "Safari" :
      "Other";

    // Parse OS from userAgent
    const os =
      /Windows/.test(userAgent) ? "Windows" :
      /Android/.test(userAgent) ? "Android" :
      /iPhone|iPad/.test(userAgent) ? "iOS" :
      /Mac OS/.test(userAgent) ? "macOS" :
      /Linux/.test(userAgent) ? "Linux" :
      "Other";

    // Avoid logging duplicate visits from the same IP within 1 hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const existing = await SiteVisit.findOne({
      ipAddress,
      createdAt: { $gte: oneHourAgo }
    });

    if (!existing) {
      await SiteVisit.create({ ipAddress, userAgent, browser, os });
    }

    return res.status(200).json({ success: true, message: "Visit logged" });
  } catch (error) {
    console.error("Log Visit Error:", error.message);
    return res.status(500).json({ success: false, message: "Error logging visit" });
  }
});


module.exports = router;
