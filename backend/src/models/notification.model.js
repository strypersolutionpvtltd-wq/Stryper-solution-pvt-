const mongoose = require("mongoose");

/**
 * Notification Model
 * ------------------
 * ARCHITECTURE:
 * - One notification belongs to one user (any role — candidate, company, admin)
 * - userId links to User model directly (not role-specific profile)
 *   because notifications are delivered per login account
 * - relatedId is a flexible string that stores the ID of the related
 *   resource (e.g. jobId, applicationId, interviewId) — kept as String
 *   so frontend can use it for deep-linking without knowing the type
 *
 * Future:
 *   Notification.create() will be called from other controllers:
 *   → jobApplication.controller  → on apply / status change
 *   → interview.controller       → on schedule / cancel
 *
 * Relation:
 *   Notification.userId → User._id
 */

const notificationSchema = new mongoose.Schema(
  {
    // FK → users.id — works for any role (CANDIDATE, COMPANY, ADMIN)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Short heading — e.g. "Application Shortlisted"
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Full message — e.g. "Your application for Senior React Developer has been shortlisted."
    message: {
      type: String,
      required: true,
      trim: true,
    },

    // Category — used by frontend to show icon/color per type
    // application → job application status changes
    // interview   → interview scheduled, cancelled, updated
    // job         → new job posted, job closed
    // profile     → profile viewed, profile completion reminder
    // system      → platform announcements, maintenance alerts
    type: {
      type: String,
      enum: ["application", "interview", "job", "profile", "system"],
      default: "system",
    },

    // Optional ID of the related resource for deep-linking
    // e.g. a jobId so frontend can route to /jobs/:id on tap
    // Stored as String for flexibility — can hold any ObjectId or slug
    relatedId: {
      type: String,
      default: "",
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt used for "2 hours ago" display
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// INDEXES
// ─────────────────────────────────────────────────────────────────────────────

// Primary query — fetch all notifications for a user, newest first
notificationSchema.index({ userId: 1, createdAt: -1 });

// Unread count badge — fetch only unread notifications quickly
notificationSchema.index({ userId: 1, isRead: 1 });

// ─────────────────────────────────────────────────────────────────────────────
const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
