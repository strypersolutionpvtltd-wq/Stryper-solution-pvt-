const Job = require("../models/job.model");
const JobApplication = require("../models/jobApplication.model");
const Interview = require("../models/interview.model");
const CandidateProfile = require("../models/candidateProfile.model");
const CompanyProfile = require("../models/companyProfile.model");

// @desc    Get candidate dashboard data
// @route   GET /api/v1/dashboard/candidate
// @access  Private (Candidate)
const getCandidateDashboard = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const candidateProfile = await CandidateProfile.findOne({ userId });
    if (!candidateProfile) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    const totalApplications = await JobApplication.countDocuments({ candidateId: candidateProfile._id });
    const pendingApplications = await JobApplication.countDocuments({
      candidateId: candidateProfile._id,
      status: "Applied",
    });
    const shortlistedApplications = await JobApplication.countDocuments({
      candidateId: candidateProfile._id,
      status: "Shortlisted",
    });
    const rejectedApplications = await JobApplication.countDocuments({
      candidateId: candidateProfile._id,
      status: "Rejected",
    });

    const upcomingInterviews = await Interview.countDocuments({
      candidateUserId: userId,
      status: "Scheduled",
      interviewDate: { $gte: new Date() },
    });

    return res.status(200).json({
      success: true,
      dashboard: {
        totalApplications,
        pendingApplications,
        shortlistedApplications,
        rejectedApplications,
        upcomingInterviews,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get company dashboard data
// @route   GET /api/v1/dashboard/company
// @access  Private (Company)
const getCompanyDashboard = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const companyProfile = await CompanyProfile.findOne({ userId });
    if (!companyProfile) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    const activeJobs = await Job.countDocuments({
      companyId: companyProfile._id,
      status: "Active",
    });

    const totalApplications = await JobApplication.countDocuments({
      companyId: companyProfile._id,
    });

    const pendingReview = await JobApplication.countDocuments({
      companyId: companyProfile._id,
      status: "Applied",
    });

    const shortlisted = await JobApplication.countDocuments({
      companyId: companyProfile._id,
      status: "Shortlisted",
    });

    const upcomingInterviews = await Interview.countDocuments({
      companyId: companyProfile._id,
      status: "Scheduled",
      interviewDate: { $gte: new Date() },
    });

    return res.status(200).json({
      success: true,
      dashboard: {
        activeJobs,
        totalApplications,
        pendingReview,
        shortlisted,
        upcomingInterviews,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  getCandidateDashboard,
  getCompanyDashboard,
};
