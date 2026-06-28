const mongoose = require("mongoose");

const siteVisitSchema = new mongoose.Schema(
  {
    ipAddress: {
      type: String,
      default: "",
    },
    userAgent: {
      type: String,
      default: "",
    },
    browser: {
      type: String,
      default: "Other",
    },
    os: {
      type: String,
      default: "Other",
    },
  },

  {
    timestamps: true,
  }
);

// Auto-delete visits older than 30 days (TTL Index)
siteVisitSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

const SiteVisit = mongoose.model("SiteVisit", siteVisitSchema);

module.exports = SiteVisit;
