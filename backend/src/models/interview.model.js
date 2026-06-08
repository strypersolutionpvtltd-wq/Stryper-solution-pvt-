const mongoose = require("mongoose");

/**
 * Interview Model
 * ---------------
 * ARCHITECTURE:
 * - One interview is linked to one JobApplication
 * - companyId stored directly (denormalized) for fast company-side queries
 * - A single application can have multiple interview rounds
 *
 * Relations:
 *   Interview.applicationId → JobApplication._id
 *   Interview.companyId     → CompanyProfile._id
 *
 * Future connections:
 *   Notification triggered  → on schedule / cancellation
 *   Candidate portal        → query via applicationId → candidateId
 */

const interviewSchema = new mongoose.Schema(
  {
    // ── Core Relations ────────────────────────────────────

    // Which application this interview is for
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobApplication",
      required: true,
    },

    // Which company scheduled this interview
    // Stored directly so company can query all their interviews without
    // joining through JobApplication every time
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyProfile",
      required: true,
    },

    // ── Interview Details ─────────────────────────────────

    // Name of the person who scheduled the interview (HR/manager name)
    scheduledBy: {
      type: String,
      trim: true,
      default: "",
    },

    // e.g. "Round 1 - Technical", "HR Discussion", "Final Round"
    interviewTitle: {
      type: String,
      required: true,
      trim: true,
    },

    interviewDate: {
      type: Date,
      required: true,
    },

    // Stored as string for flexible 12h display — e.g. "2:00 PM", "11:30 AM"
    interviewTime: {
      type: String,
      required: true,
      trim: true,
    },

    interviewType: {
      type: String,
      enum: ["Video", "In-person", "Phone"],
      default: "Video",
    },

    // ── Meeting Details ───────────────────────────────────

    meetingPlatform: {
      type: String,
      enum: ["Google Meet", "Zoom", "Microsoft Teams", "Other"],
      default: "Google Meet",
    },

    // Actual meeting URL — added when company sets up the link
    meetingLink: {
      type: String,
      trim: true,
      default: "",
    },

    // ── Status ────────────────────────────────────────────
    // Scheduled  → confirmed and upcoming
    // Completed  → interview done
    // Cancelled  → cancelled by company
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },

    // Internal notes for the interviewer — not shown to candidate
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// INDEXES
// ─────────────────────────────────────────────────────────────────────────────

// Company's Interviews page — fetch all interviews for a company
interviewSchema.index({ companyId: 1 });

// Company filter by status — e.g. only Scheduled interviews
interviewSchema.index({ companyId: 1, status: 1 });

// Candidate's interviews — fetched via applicationId
interviewSchema.index({ applicationId: 1 });

// Sort interviews by date efficiently
interviewSchema.index({ interviewDate: 1 });

// ─────────────────────────────────────────────────────────────────────────────
const Interview = mongoose.model("Interview", interviewSchema);

module.exports = Interview;
