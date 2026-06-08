const mongoose = require("mongoose");

/**
 * CandidateProfile Model
 * ----------------------
 * ARCHITECTURE RULE:
 * - Authentication data (email, password, role) belongs ONLY in the User model
 * - This schema stores ONLY personal profile, resume, and career-related data
 * - userId is the source of truth — always use it to link back to the User model
 *
 * Relation: CandidateProfile.userId → User._id
 */

const candidateProfileSchema = new mongoose.Schema(
  {
    // Link to authentication user — one profile per candidate
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // ── Personal Information ──────────────────────────────
    fullName: {
      type: String,
      trim: true,
      default: "",
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

    profilePicture: {
      type: String,
      default: "",
    },

    // ── Career Information ────────────────────────────────
    professionalSummary: {
      type: String,
      trim: true,
      default: "",
    },

    preferredRole: {
      type: String,
      trim: true,
      default: "",
    },

    experienceLevel: {
      type: String,
      enum: ["Entry Level", "Junior", "Mid Level", "Senior", "Lead", "Manager"],
      default: "Entry Level",
    },

    salaryExpectation: {
      type: String,
      trim: true,
      default: "",
    },

    noticePeriod: {
      type: String,
      trim: true,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    // ── Resume ────────────────────────────────────────────
    resumeUrl: {
      type: String,
      default: "",
    },

    // ── Profile Completion ────────────────────────────────
    profileStrength: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

const CandidateProfile = mongoose.model("CandidateProfile", candidateProfileSchema);

module.exports = CandidateProfile;
