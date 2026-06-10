const User = require("../models/user.model");
const Job = require("../models/job.model");
const JobApplication = require("../models/jobApplication.model");
const CompanyProfile = require("../models/companyProfile.model");
const CandidateProfile = require("../models/candidateProfile.model");

// @desc    Get platform statistics
// @route   GET /api/v1/admin/stats
// @access  Private (Admin)
const getPlatformStats = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId);
    if (user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this",
      });
    }

    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await JobApplication.countDocuments();
    const totalCompanies = await CompanyProfile.countDocuments();
    const totalCandidates = await CandidateProfile.countDocuments();

    const activeJobs = await Job.countDocuments({ status: "Active" });

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalJobs,
        totalApplications,
        totalCompanies,
        totalCandidates,
        activeJobs,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 10, role, status } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId);
    if (user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this",
      });
    }

    const filter = {};
    if (role) filter.role = role;
    if (status) filter.accountStatus = status;

    const users = await User.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    return res.status(200).json({
      success: true,
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get all jobs
// @route   GET /api/v1/admin/jobs
// @access  Private (Admin)
const getAllJobs = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 10, status } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId);
    if (user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this",
      });
    }

    const filter = {};
    if (status) filter.status = status;

    const jobs = await Job.find(filter)
      .populate("companyId", "companyName")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments(filter);

    return res.status(200).json({
      success: true,
      jobs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get all applications
// @route   GET /api/v1/admin/applications
// @access  Private (Admin)
const getAllApplications = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 10, status } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId);
    if (user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this",
      });
    }

    const filter = {};
    if (status) filter.status = status;

    const applications = await JobApplication.find(filter)
      .populate("jobId", "title")
      .populate("companyId", "companyName")
      .populate("candidateId", "firstName lastName")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ appliedDate: -1 });

    const total = await JobApplication.countDocuments(filter);

    return res.status(200).json({
      success: true,
      applications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Update user status
// @route   PATCH /api/v1/admin/users/:id/status
// @access  Private (Admin)
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { accountStatus } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId);
    if (user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this",
      });
    }

    if (!accountStatus || !["Active", "Suspended"].includes(accountStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'Active' or 'Suspended'",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { accountStatus },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User status updated",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update user status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  getPlatformStats,
  getAllUsers,
  getAllJobs,
  getAllApplications,
  updateUserStatus,
};
