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
  },
  {
    timestamps: true,
  }
);

const SiteVisit = mongoose.model("SiteVisit", siteVisitSchema);

module.exports = SiteVisit;
