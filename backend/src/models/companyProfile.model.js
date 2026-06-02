const mongoose = require("mongoose");

/**
 * CompanyProfile Model
 * --------------------
 * ARCHITECTURE RULE:
 * - Authentication data (password, role) belongs ONLY in the User model
 * - userId is the source of truth — always use it to link back to the User model
 *
 * NOTE ON EMAIL FIELD:
 * - The User model holds the authentication email (login credentials)
 * - The email field here is treated as the PUBLIC BUSINESS CONTACT EMAIL
 *   (e.g. hr@company.com or info@company.com shown on job listings / company page)
 * - These two emails may intentionally differ — do NOT remove this field
 *
 * Relation: CompanyProfile.userId → User._id
 */

const companyProfileSchema = new mongoose.Schema(
  {
    // Link to authentication user — one profile per company
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // ── Company Identity ──────────────────────────────────
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    industry: {
      type: String,
      required: true,
      trim: true,
    },

    companySize: {
      type: String,
      required: true,
      trim: true,
    },

    companyLogo: {
      type: String,
      default: "",
    },

    companyDescription: {
      type: String,
      required: true,
      trim: true,
    },

    foundedYear: {
      type: Number,
      default: null,
    },

    // ── Online Presence ───────────────────────────────────
    website: {
      type: String,
      trim: true,
      default: "",
    },

    linkedin: {
      type: String,
      trim: true,
      default: "",
    },

    // ── Public Business Contact ───────────────────────────
    // NOTE: This is the public-facing HR/business contact email
    // Authentication email lives in User model — do NOT confuse the two
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    // ── HR Contact ────────────────────────────────────────
    hrName: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const CompanyProfile = mongoose.model("CompanyProfile", companyProfileSchema);

module.exports = CompanyProfile;
