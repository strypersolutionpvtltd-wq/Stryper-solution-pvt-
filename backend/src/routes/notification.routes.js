const express = require("express");
const {
  getMyNotifications,
  markAllAsRead,
  markOneAsRead,
  deleteNotification,
} = require("../controllers/notification.controller");
const { protect: authMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

// Private routes (authenticated)
router.get("/", authMiddleware, getMyNotifications);
router.patch("/read-all", authMiddleware, markAllAsRead);
router.patch("/:id/read", authMiddleware, markOneAsRead);
router.delete("/:id", authMiddleware, deleteNotification);

module.exports = router;
