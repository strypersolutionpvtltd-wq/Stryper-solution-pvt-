const CompanyProfile  = require("../models/companyProfile.model");
const Job             = require("../models/job.model");
const JobApplication  = require("../models/jobApplication.model");
const Interview       = require("../models/interview.model");

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get KPI stats for the logged-in company's dashboard
// @route   GET /api/v1/dashboard/company/stats
// @access  Private — COMPANY only
// ─────────────────────────────────────────────────────────────────────────────
const getCompanyDashboardStats = async (req, res) => {
  try {
    // 1. Get the logged-in company's profile
    //    SECURITY: companyId always from server — never from request body
    const company = await CompanyProfile.findOne({ userId: req.user.id });
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found.",
      });
    }

    // 2. Build today's date range for "scheduledInterviewsToday"
    //    Start = 00:00:00.000, End = 23:59:59.999 in local midnight UTC
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // 3. Run all counts in parallel for performance
    const [
      activeJobsCount,
      totalApplicants,
      hiredCount,
      scheduledInterviewsToday,
    ] = await Promise.all([
      // Active job postings by this company
      Job.countDocuments({
        companyId: company._id,
        status:    "Active",
      }),

      // Total applications received across all company jobs
      JobApplication.countDocuments({
        companyId: company._id,
      }),

      // Applications that reached "Hired" stage
      JobApplication.countDocuments({
        companyId: company._id,
        status:    "Hired",
      }),

      // Interviews scheduled for today (status = Scheduled, date = today)
      Interview.countDocuments({
        companyId:     company._id,
        status:        "Scheduled",
        interviewDate: { $gte: todayStart, $lte: todayEnd },
      }),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        activeJobsCount,
        totalApplicants,
        hiredCount,
        scheduledInterviewsToday,
      },
    });
  } catch (error) {
    console.error("Company Dashboard Stats Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching dashboard stats.",
    });
  }
};

module.exports = { getCompanyDashboardStats };
