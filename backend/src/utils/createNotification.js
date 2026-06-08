const Notification = require("../models/notification.model");

/**
 * createNotification — Reusable notification utility
 * ---------------------------------------------------
 * Call this from any controller after a significant action occurs.
 * It silently creates a notification without interrupting the main
 * API response — errors here are logged but never crash the caller.
 *
 * @param {Object} params
 * @param {string} params.userId     — User._id (as string or ObjectId)
 * @param {string} params.title      — Short heading, e.g. "Application Shortlisted"
 * @param {string} params.message    — Full message shown to user
 * @param {string} params.type       — "application" | "interview" | "job" | "profile" | "system"
 * @param {string} [params.relatedId] — Optional ID for deep-linking (jobId, applicationId, etc.)
 *
 * @example
 *   await createNotification({
 *     userId:    candidate.userId,
 *     title:     "Application Submitted",
 *     message:   `You have successfully applied for ${job.title}.`,
 *     type:      "application",
 *     relatedId: job._id.toString(),
 *   });
 */
const createNotification = async ({ userId, title, message, type = "system", relatedId = "" }) => {
  try {
    await Notification.create({ userId, title, message, type, relatedId });
  } catch (error) {
    // Log but never throw — notification failure must not break the main API response
    console.error("createNotification Error:", error.message);
  }
};

module.exports = createNotification;
