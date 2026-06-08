const JobApplication = require("../models/jobApplication.model");
const CandidateProfile = require("../models/candidateProfile.model");
const CompanyProfile = require("../models/companyProfile.model");
const Job = require("../models/job.model");
const createNotification = require("../utils/createNotification");

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS — fetch profiles from DB using req.user.id
// SECURITY: IDs always come from server — never from request body
// ─────────────────────────────────────────────────────────────────────────────
const getCandidateProfile = (userId) =>
  CandidateProfile.findOne({ userId });

const getCompanyProfile = (userId) =>
  CompanyProfile.findOne({ userId });

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Apply for a job
// @route   POST /api/v1/applications
// @access  Private — CANDIDATE only
// ─────────────────────────────────────────────────────────────────────────────
const applyForJob = async (req, res) => {
  try {
    const { jobId, resumeUrl, coverLetter, expectedSalary, noticePeriod, currentLocation } =
      req.body;

    // 1. Validate required fields
    if (!jobId || !resumeUrl) {
      return res.status(400).json({
        success: false,
        message: "jobId and resumeUrl are required.",
      });
    }

    // 2. Get the logged-in candidate's profile
    //    SECURITY: candidateId always comes from server, never from request body
    const candidate = await getCandidateProfile(req.user.id);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found. Please create your profile before applying.",
      });
    }

    // 3. Check the job exists and is currently accepting applications
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    if (job.status !== "Active") {
      return res.status(400).json({
        success: false,
        message: "This job is no longer accepting applications.",
      });
    }

    // 4. Check application deadline
    if (job.applicationDeadline && new Date() > new Date(job.applicationDeadline)) {
      return res.status(400).json({
        success: false,
        message: "The application deadline for this job has passed.",
      });
    }

    // 5. Prevent duplicate application
    //    (also enforced at DB level via unique index as a safety net)
    const alreadyApplied = await JobApplication.findOne({
      jobId,
      candidateId: candidate._id,
    });

    if (alreadyApplied) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    // 6. Create the application
    //    companyId comes from the Job document — never from the frontend
    const application = await JobApplication.create({
      jobId,
      candidateId: candidate._id,
      companyId:   job.companyId,
      resumeUrl,
      coverLetter:     coverLetter     || "",
      expectedSalary:  expectedSalary  || "",
      noticePeriod:    noticePeriod    || "",
      currentLocation: currentLocation || "",
      status: "Applied",
    });

    // 7. Notify candidate — fire-and-forget (does not affect response)
    await createNotification({
      userId:    req.user.id,
      title:     "Application Submitted",
      message:   `Your application for "${job.title}" has been submitted successfully.`,
      type:      "application",
      relatedId: job._id.toString(),
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      application,
    });
  } catch (error) {
    // Handle DB-level duplicate key error as a fallback
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    console.error("Apply For Job Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while submitting application.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all applications submitted by the logged-in candidate
// @route   GET /api/v1/applications/me
// @access  Private — CANDIDATE only
//
// Query params:
//   page   → page number (default: 1)
//   limit  → results per page (default: 10)
//   status → filter by pipeline status (optional)
// ─────────────────────────────────────────────────────────────────────────────
const getMyApplications = async (req, res) => {
  try {
    // 1. Get logged-in candidate profile
    const candidate = await getCandidateProfile(req.user.id);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found.",
      });
    }

    const { page = 1, limit = 10, status } = req.query;

    // 2. Build filter — always scoped to this candidate
    const filter = { candidateId: candidate._id };

    if (status && ["Applied", "Screening", "Interview", "Offer", "Hired", "Rejected"].includes(status)) {
      filter.status = status;
    }

    // 3. Pagination
    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    // 4. Query with populated job and company details
    const [applications, totalApplications] = await Promise.all([
      JobApplication.find(filter)
        .populate({
          path:   "jobId",
          select: "title department location employmentType experienceLevel salaryMin salaryMax status slug",
        })
        .populate({
          path:   "companyId",
          select: "companyName industry location companyLogo",
        })
        .sort({ createdAt: -1 }) // newest first
        .skip(skip)
        .limit(limitNum)
        .lean(),
      JobApplication.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalApplications / limitNum);

    return res.status(200).json({
      success: true,
      pagination: {
        totalApplications,
        totalPages,
        currentPage: pageNum,
        limit:       limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      applications,
    });
  } catch (error) {
    console.error("Get My Applications Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching your applications.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all applicants for a specific job
// @route   GET /api/v1/applications/job/:jobId
// @access  Private — COMPANY only (owner only)
//
// Query params:
//   page   → page number (default: 1)
//   limit  → results per page (default: 10)
//   status → filter by pipeline status (optional)
// ─────────────────────────────────────────────────────────────────────────────
const getJobApplicants = async (req, res) => {
  try {
    // 1. Get logged-in company profile
    const company = await getCompanyProfile(req.user.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found.",
      });
    }

    // 2. Verify the job exists
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    // 3. Ownership check — only the company that posted this job can view its applicants
    if (job.companyId.toString() !== company._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only view applicants for your own job postings.",
      });
    }

    const { page = 1, limit = 10, status } = req.query;

    // 4. Build filter
    const filter = { jobId: req.params.jobId };

    if (status && ["Applied", "Screening", "Interview", "Offer", "Hired", "Rejected"].includes(status)) {
      filter.status = status;
    }

    // 5. Pagination
    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    // 6. Query with populated candidate details
    const [applications, totalApplications] = await Promise.all([
      JobApplication.find(filter)
        .populate({
          path:   "candidateId",
          select: "fullName phone location profilePicture experienceLevel skills preferredRole resumeUrl",
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      JobApplication.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalApplications / limitNum);

    return res.status(200).json({
      success: true,
      job: {
        id:    job._id,
        title: job.title,
        status: job.status,
      },
      pagination: {
        totalApplications,
        totalPages,
        currentPage: pageNum,
        limit:       limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      applications,
    });
  } catch (error) {
    console.error("Get Job Applicants Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching applicants.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update application pipeline status
// @route   PATCH /api/v1/applications/:id/status
// @access  Private — COMPANY only (owner only)
// ─────────────────────────────────────────────────────────────────────────────
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // 1. Validate status value
    const allowedStatuses = ["Applied", "Screening", "Interview", "Offer", "Hired", "Rejected"];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}.`,
      });
    }

    // 2. Get logged-in company profile
    const company = await getCompanyProfile(req.user.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found.",
      });
    }

    // 3. Find the application
    const application = await JobApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    // 4. Ownership check — only the company that owns this job can update the status
    if (application.companyId.toString() !== company._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only update applications for your own job postings.",
      });
    }

    // 5. Update only the status field
    application.status = status;
    await application.save();

    // 6. Notify the candidate about their pipeline stage change
    //    We need candidate's userId — fetch via CandidateProfile
    const candidateProfile = await CandidateProfile.findById(application.candidateId).select("userId");
    if (candidateProfile) {
      await createNotification({
        userId:    candidateProfile.userId,
        title:     "Application Status Updated",
        message:   `Your application status has been updated to "${status}".`,
        type:      "application",
        relatedId: application._id.toString(),
      });
    }

    return res.status(200).json({
      success: true,
      message: `Application status updated to "${status}".`,
      application: {
        id:          application._id,
        status:      application.status,
        candidateId: application.candidateId,
        jobId:       application.jobId,
      },
    });
  } catch (error) {
    console.error("Update Application Status Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while updating application status.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Withdraw (delete) an application
// @route   DELETE /api/v1/applications/:id
// @access  Private — CANDIDATE only (owner only)
// ─────────────────────────────────────────────────────────────────────────────
const withdrawApplication = async (req, res) => {
  try {
    // 1. Get logged-in candidate profile
    const candidate = await getCandidateProfile(req.user.id);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found.",
      });
    }

    // 2. Find the application
    const application = await JobApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    // 3. Ownership check — candidate can only withdraw their own application
    if (application.candidateId.toString() !== candidate._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only withdraw your own applications.",
      });
    }

    // 4. Business rule — prevent withdrawal after offer or hire stage
    if (["Offer", "Hired"].includes(application.status)) {
      return res.status(400).json({
        success: false,
        message: `Application cannot be withdrawn at "${application.status}" stage. Please contact the company directly.`,
      });
    }

    // 5. Delete the application
    await JobApplication.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Application withdrawn successfully.",
    });
  } catch (error) {
    console.error("Withdraw Application Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while withdrawing application.",
    });
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  withdrawApplication,
};
