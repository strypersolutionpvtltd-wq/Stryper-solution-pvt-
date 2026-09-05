const Notification = require("../models/notification.model");
const CompanyProfile = require("../models/companyProfile.model");
const Job = require("../models/job.model");
const JobApplication = require("../models/jobApplication.model");
const Interview = require("../models/interview.model");

// @desc    Get my notifications
// @route   GET /api/v1/notifications
// @access  Private
const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 });

    const resolvedNotifications = await Promise.all(
      notifications.map(async (n) => {
        const notifObj = n.toObject();
        notifObj.companyName = "";
        notifObj.jobTitle = "";

        if (notifObj.relatedId && notifObj.relatedModel) {
          try {
            if (notifObj.relatedModel === "CompanyProfile") {
              const company = await CompanyProfile.findById(notifObj.relatedId).select("companyName");
              if (company) {
                notifObj.companyName = company.companyName;
              }
            } else if (notifObj.relatedModel === "Job") {
              const job = await Job.findById(notifObj.relatedId)
                .populate("companyId", "companyName")
                .select("title companyId");
              if (job) {
                notifObj.jobTitle = job.title;
                if (job.companyId) {
                  notifObj.companyName = job.companyId.companyName;
                }
              }
            } else if (notifObj.relatedModel === "JobApplication") {
              const app = await JobApplication.findById(notifObj.relatedId)
                .populate("jobId", "title")
                .populate("companyId", "companyName")
                .select("jobId companyId");
              if (app) {
                if (app.jobId) notifObj.jobTitle = app.jobId.title;
                if (app.companyId) notifObj.companyName = app.companyId.companyName;
              }
            } else if (notifObj.relatedModel === "Interview") {
              const interview = await Interview.findById(notifObj.relatedId)
                .populate("jobId", "title")
                .populate("companyId", "companyName")
                .select("jobId companyId");
              if (interview) {
                if (interview.jobId) notifObj.jobTitle = interview.jobId.title;
                if (interview.companyId) notifObj.companyName = interview.companyId.companyName;
              }
            }
          } catch (err) {
            console.error(`Failed to resolve details for notification ${n._id}:`, err);
          }
        }
        return notifObj;
      })
    );

    return res.status(200).json({
      success: true,
      notifications: resolvedNotifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/v1/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await Notification.updateMany({ userId }, { isRead: true });

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to mark notifications as read",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Mark one notification as read
// @route   PATCH /api/v1/notifications/:id/read
// @access  Private
const markOneAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    if (notification.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await Notification.findByIdAndUpdate(id, { isRead: true });

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Delete notification
// @route   DELETE /api/v1/notifications/:id
// @access  Private
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    if (notification.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await Notification.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete notification",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  getMyNotifications,
  markAllAsRead,
  markOneAsRead,
  deleteNotification,
};
