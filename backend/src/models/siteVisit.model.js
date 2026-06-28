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

const SiteVisit = mongoose.model("SiteVisit", siteVisitSchema);

module.exports = SiteVisit;
