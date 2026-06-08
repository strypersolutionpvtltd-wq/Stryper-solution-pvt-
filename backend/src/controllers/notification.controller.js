const Notification = require("../models/notification.model");

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all notifications for the logged-in user
// @route   GET /api/v1/notifications
// @access  Private — any logged-in user (CANDIDATE / COMPANY / ADMIN)
//
// Query params:
//   page   → page number (default: 1)
//   limit  → results per page (default: 20)
//   unread → "true" to fetch only unread notifications (optional)
// ─────────────────────────────────────────────────────────────────────────────
const getMyNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, unread } = req.query;

    // 1. Build filter — always scoped to logged-in user
    //    SECURITY: userId always comes from JWT token, never from request body
    const filter = { userId: req.user.id };

    if (unread === "true") {
      filter.isRead = false;
    }

    // 2. Pagination
    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    // 3. Run query + unread count in parallel
    const [notifications, totalNotifications, unreadCount] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 }) // newest first
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Notification.countDocuments(filter),
      // Always return total unread count for the notification badge
      Notification.countDocuments({ userId: req.user.id, isRead: false }),
    ]);

    const totalPages = Math.ceil(totalNotifications / limitNum);

    return res.status(200).json({
      success: true,
      unreadCount, // used by frontend for the notification bell badge
      pagination: {
        totalNotifications,
        totalPages,
        currentPage: pageNum,
        limit:       limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      notifications,
    });
  } catch (error) {
    console.error("Get Notifications Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching notifications.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Mark all notifications as read
// @route   PATCH /api/v1/notifications/read-all
// @access  Private — any logged-in user
// ─────────────────────────────────────────────────────────────────────────────
const markAllAsRead = async (req, res) => {
  try {
    // Update only this user's unread notifications
    const result = await Notification.updateMany(
      { userId: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read.",
      updatedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Mark All Read Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while marking notifications as read.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Mark a single notification as read
// @route   PATCH /api/v1/notifications/:id/read
// @access  Private — any logged-in user (owner only)
// ─────────────────────────────────────────────────────────────────────────────
const markOneAsRead = async (req, res) => {
  try {
    // Find and update — userId check ensures ownership
    // SECURITY: user cannot mark another user's notification as read
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: { isRead: true } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read.",
      notification,
    });
  } catch (error) {
    console.error("Mark One Read Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while marking notification as read.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete a single notification
// @route   DELETE /api/v1/notifications/:id
// @access  Private — any logged-in user (owner only)
// ─────────────────────────────────────────────────────────────────────────────
const deleteNotification = async (req, res) => {
  try {
    // Find and delete — userId check ensures ownership
    // SECURITY: user cannot delete another user's notification
    const notification = await Notification.findOneAndDelete({
      _id:    req.params.id,
      userId: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted.",
    });
  } catch (error) {
    console.error("Delete Notification Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting notification.",
    });
  }
};

module.exports = {
  getMyNotifications,
  markAllAsRead,
  markOneAsRead,
  deleteNotification,
};
