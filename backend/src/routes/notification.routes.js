const express = require("express");
const { protect } = require("../middleware/auth.middleware");
const {
  getMyNotifications,
  markAllAsRead,
  markOneAsRead,
  deleteNotification,
} = require("../controllers/notification.controller");

const router = express.Router();

// All routes require authentication — open to any role (no authorizeRoles needed)

// GET /api/v1/notifications — get my notifications (paginated, newest first)
router.get("/", protect, getMyNotifications);

// PATCH /api/v1/notifications/read-all — mark all as read
// NOTE: defined before /:id so "read-all" is not parsed as a Mongo ID
router.patch("/read-all", protect, markAllAsRead);

// PATCH /api/v1/notifications/:id/read — mark one as read
router.patch("/:id/read", protect, markOneAsRead);

// DELETE /api/v1/notifications/:id — delete one notification
router.delete("/:id", protect, deleteNotification);

module.exports = router;
