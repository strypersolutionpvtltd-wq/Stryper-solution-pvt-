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

    const totalJobs = await Job.countDocuments({ companyId: companyProfile._id });

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

    const hiredCount = await JobApplication.countDocuments({
      companyId: companyProfile._id,
      status: "Hired",
    });

    const upcomingInterviews = await Interview.countDocuments({
      companyId: companyProfile._id,
      status: "Scheduled",
      interviewDate: { $gte: new Date() },
    });

    // Pipeline breakdown
    const pipeline = await JobApplication.aggregate([
      { $match: { companyId: companyProfile._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const pipelineMap = {};
    pipeline.forEach(p => { pipelineMap[p._id] = p.count; });

    // Recent applications (last 6)
    const recentApplications = await JobApplication.find({ companyId: companyProfile._id })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("candidateId", "firstName lastName location")
      .populate("jobId", "title");

    // Active jobs with applicant counts
    const activeJobsList = await Job.find({ companyId: companyProfile._id, status: "Active" })
      .sort({ createdAt: -1 })
      .limit(4);

    const activeJobsWithCounts = await Promise.all(
      activeJobsList.map(async (job) => {
        const count = await JobApplication.countDocuments({ jobId: job._id });
        return {
          id: job._id,
          title: job.title,
          applicants: count,
          daysLeft: job.applicationDeadline
            ? Math.max(0, Math.ceil((new Date(job.applicationDeadline) - new Date()) / (1000 * 60 * 60 * 24)))
            : null,
          progress: Math.min(100, Math.round((count / (job.vacancies || 1)) * 100)),
        };
      })
    );

    // Hiring trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    const trends = await JobApplication.aggregate([
      { $match: { companyId: companyProfile._id, createdAt: { $gte: sixMonthsAgo } } },
      { $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        applications: { $sum: 1 },
        hired: { $sum: { $cond: [{ $eq: ["$status", "Hired"] }, 1, 0] } },
      }},
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
    const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const chartData = trends.map(t => ({
      month: MONTHS[t._id.month - 1],
      applications: t.applications,
      hired: t.hired,
    }));

    return res.status(200).json({
      success: true,
      dashboard: {
        totalJobs,
        activeJobs,
        totalApplications,
        pendingReview,
        shortlisted,
        hiredCount,
        upcomingInterviews,
        pipeline: pipelineMap,
        recentApplications: recentApplications.map(a => ({
          id: a._id,
          name: `${a.candidateId?.firstName || ''} ${a.candidateId?.lastName || ''}`.trim() || 'Unknown',
          role: a.jobId?.title || 'Position',
          status: a.status,
          date: a.createdAt,
          location: a.candidateId?.location || '',
        })),
        activeJobs: activeJobsWithCounts,
        chartData,
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

// @desc    Get company analytics data
// @route   GET /api/v1/dashboard/company/analytics
// @access  Private (Company)
const getCompanyAnalytics = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const companyProfile = await CompanyProfile.findOne({ userId });
    if (!companyProfile) return res.status(404).json({ success: false, message: "Company profile not found" });

    const cId = companyProfile._id;

    // ── KPIs ──────────────────────────────────────────────────────────────
    const totalApplications = await JobApplication.countDocuments({ companyId: cId });
    const acceptedCount     = await JobApplication.countDocuments({ companyId: cId, status: "Accepted" });
    const hireRate          = totalApplications > 0 ? Math.round((acceptedCount / totalApplications) * 100) : 0;

    const offerCount        = await JobApplication.countDocuments({ companyId: cId, status: { $in: ["Accepted", "Shortlisted"] } });
    const offerAcceptance   = offerCount > 0 ? Math.round((acceptedCount / offerCount) * 100) : 0;

    // Avg time to hire: days from appliedDate to status=Accepted
    const hiredApps = await JobApplication.find({ companyId: cId, status: "Accepted" }).select("appliedDate updatedAt");
    let avgTimeToHire = 0;
    if (hiredApps.length > 0) {
      const totalDays = hiredApps.reduce((sum, a) => {
        const days = Math.round((new Date(a.updatedAt) - new Date(a.appliedDate)) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0);
      avgTimeToHire = Math.round(totalDays / hiredApps.length);
    }

    // ── Monthly trend (last 6 months) ────────────────────────────────────
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    const trends = await JobApplication.aggregate([
      { $match: { companyId: cId, createdAt: { $gte: sixMonthsAgo } } },
      { $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        applications: { $sum: 1 },
        hired: { $sum: { $cond: [{ $eq: ["$status", "Accepted"] }, 1, 0] } },
      }},
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
    const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const chartData = trends.map(t => ({
      month:        MONTHS[t._id.month - 1],
      applications: t.applications,
      hired:        t.hired,
    }));

    // ── Pipeline funnel ────────────────────────────────────────────────
    const pipelineAgg = await JobApplication.aggregate([
      { $match: { companyId: cId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const pipelineMap = {};
    pipelineAgg.forEach(p => { pipelineMap[p._id] = p.count; });
    const pipelineStages = [
      { stage: "Applied",     count: pipelineMap["Applied"]     || 0, color: "#8B3A8F" },
      { stage: "Screening",   count: pipelineMap["Reviewed"]    || 0, color: "#2563eb" },
      { stage: "Interview",   count: pipelineMap["Shortlisted"] || 0, color: "#d97706" },
      { stage: "Offer",       count: pipelineMap["Shortlisted"] || 0, color: "#f59e0b" },
      { stage: "Hired",       count: pipelineMap["Accepted"]    || 0, color: "#16a34a" },
    ];

    // ── Dept breakdown (from jobs) ────────────────────────────────────
    const jobs = await Job.find({ companyId: cId }).select("department status applicationCount");
    const deptMap = {};
    const DEPT_COLORS = ['#8B3A8F','#2563eb','#16a34a','#d97706','#0d9488','#ea580c','#6366f1'];
    jobs.forEach(j => {
      const dept = j.department || 'Other';
      if (!deptMap[dept]) deptMap[dept] = { openings: 0, filled: 0 };
      deptMap[dept].openings++;
      if (j.status === 'Closed') deptMap[dept].filled++;
    });
    const deptData = Object.entries(deptMap).map(([dept, v], i) => ({
      dept, ...v, color: DEPT_COLORS[i % DEPT_COLORS.length],
    }));

    // ── Time to hire by job title ─────────────────────────────────────
    const hiredWithJob = await JobApplication.find({ companyId: cId, status: "Accepted" })
      .populate("jobId", "title")
      .select("appliedDate updatedAt jobId");

    const jobTimeMap = {};
    hiredWithJob.forEach(a => {
      const title = a.jobId?.title || 'Unknown';
      const days = Math.round((new Date(a.updatedAt) - new Date(a.appliedDate)) / (1000 * 60 * 60 * 24));
      if (!jobTimeMap[title]) jobTimeMap[title] = { total: 0, count: 0 };
      jobTimeMap[title].total += days;
      jobTimeMap[title].count++;
    });
    const timeToHire = Object.entries(jobTimeMap)
      .map(([role, v]) => ({ role, days: Math.round(v.total / v.count) }))
      .sort((a, b) => b.days - a.days)
      .slice(0, 6);

    return res.status(200).json({
      success: true,
      analytics: {
        kpis: { totalApplications, hireRate, avgTimeToHire, offerAcceptance },
        chartData,
        pipelineStages,
        deptData,
        timeToHire,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  getCandidateDashboard,
  getCompanyDashboard,
  getCompanyAnalytics,
};
