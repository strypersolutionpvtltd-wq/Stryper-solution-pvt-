const User            = require("../models/user.model");
const CandidateProfile = require("../models/candidateProfile.model");
const CandidateExperience = require("../models/candidateExperience.model");
const CandidateEducation  = require("../models/candidateEducation.model");
const CompanyProfile  = require("../models/companyProfile.model");
const Job             = require("../models/job.model");
const JobApplication  = require("../models/jobApplication.model");
const Interview       = require("../models/interview.model");
const SavedJob        = require("../models/savedJob.model");
const Notification    = require("../models/notification.model");

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get platform-wide statistics
// @route   GET /api/v1/admin/stats
// @access  Private — ADMIN only
// ─────────────────────────────────────────────────────────────────────────────
const getPlatformStats = async (req, res) => {
  try {
    // Run all counts in parallel for performance
    const [
      totalUsers,
      totalCandidates,
      totalCompanies,
      totalJobs,
      totalApplications,
      totalInterviews,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "CANDIDATE" }),
      User.countDocuments({ role: "COMPANY" }),
      Job.countDocuments(),
      JobApplication.countDocuments(),
      Interview.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalCandidates,
        totalCompanies,
        totalJobs,
        totalApplications,
        totalInterviews,
      },
    });
  } catch (error) {
    console.error("Admin Get Stats Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching platform stats.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all users with search and role filter
// @route   GET /api/v1/admin/users
// @access  Private — ADMIN only
//
// Query params:
//   page   → page number (default: 1)
//   limit  → results per page (default: 10)
//   role   → filter by role: CANDIDATE | COMPANY | ADMIN (optional)
//   email  → search by email (partial match, optional)
// ─────────────────────────────────────────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, email } = req.query;

    // Build filter
    const filter = {};

    if (role && ["CANDIDATE", "COMPANY", "ADMIN"].includes(role)) {
      filter.role = role;
    }

    if (email && email.trim()) {
      filter.email = new RegExp(email.trim(), "i"); // partial match
    }

    // Pagination
    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    const [users, totalUsers] = await Promise.all([
      User.find(filter)
        .select("-password") // never expose password
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      pagination: {
        totalUsers,
        totalPages: Math.ceil(totalUsers / limitNum),
        currentPage: pageNum,
        limit: limitNum,
        hasNextPage: pageNum < Math.ceil(totalUsers / limitNum),
        hasPrevPage: pageNum > 1,
      },
      users,
    });
  } catch (error) {
    console.error("Admin Get All Users Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching users.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update a user's account status (Active / Suspended)
// @route   PATCH /api/v1/admin/users/:id/status
// @access  Private — ADMIN only
// ─────────────────────────────────────────────────────────────────────────────
const updateUserStatus = async (req, res) => {
  try {
    const { accountStatus } = req.body;

    // 1. Validate
    if (!accountStatus || !["Active", "Suspended"].includes(accountStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid accountStatus. Allowed values: Active, Suspended.",
      });
    }

    // 2. Prevent admin from suspending themselves
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own account status.",
      });
    }

    // 3. Find and update
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { accountStatus },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `User account status updated to "${accountStatus}".`,
      user,
    });
  } catch (error) {
    console.error("Admin Update User Status Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while updating user status.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete a user and all their linked data
// @route   DELETE /api/v1/admin/users/:id
// @access  Private — ADMIN only
//
// Deletion cascade:
//   CANDIDATE → CandidateProfile → Education, Experience, Applications,
//               SavedJobs, Interviews (via applications)
//   COMPANY   → CompanyProfile → Jobs → Applications → Interviews
//   ALL       → Notifications
// ─────────────────────────────────────────────────────────────────────────────
const deleteUser = async (req, res) => {
  try {
    // 1. Prevent admin from deleting themselves
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account.",
      });
    }

    // 2. Find the user
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // 3. Cascade delete based on role
    if (user.role === "CANDIDATE") {
      const profile = await CandidateProfile.findOne({ userId: user._id });

      if (profile) {
        // Delete education and experience records
        await Promise.all([
          CandidateEducation.deleteMany({ candidateId: profile._id }),
          CandidateExperience.deleteMany({ candidateId: profile._id }),
          SavedJob.deleteMany({ candidateId: profile._id }),
        ]);

        // Find applications to cascade into interviews
        const applications = await JobApplication.find(
          { candidateId: profile._id },
          "_id"
        );
        const appIds = applications.map((a) => a._id);

        await Promise.all([
          Interview.deleteMany({ applicationId: { $in: appIds } }),
          JobApplication.deleteMany({ candidateId: profile._id }),
          CandidateProfile.findByIdAndDelete(profile._id),
        ]);
      }
    }

    if (user.role === "COMPANY") {
      const profile = await CompanyProfile.findOne({ userId: user._id });

      if (profile) {
        // Find all jobs by this company
        const jobs = await Job.find({ companyId: profile._id }, "_id");
        const jobIds = jobs.map((j) => j._id);

        // Find all applications for those jobs
        const applications = await JobApplication.find(
          { jobId: { $in: jobIds } },
          "_id"
        );
        const appIds = applications.map((a) => a._id);

        await Promise.all([
          Interview.deleteMany({ applicationId: { $in: appIds } }),
          JobApplication.deleteMany({ jobId: { $in: jobIds } }),
          Job.deleteMany({ companyId: profile._id }),
          CompanyProfile.findByIdAndDelete(profile._id),
        ]);
      }
    }

    // 4. Delete notifications for this user
    await Notification.deleteMany({ userId: user._id });

    // 5. Delete the user account itself
    await User.findByIdAndDelete(user._id);

    return res.status(200).json({
      success: true,
      message: "User and all linked data deleted successfully.",
    });
  } catch (error) {
    console.error("Admin Delete User Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting user.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all company profiles
// @route   GET /api/v1/admin/companies
// @access  Private — ADMIN only
//
// Query params:
//   page     → page number (default: 1)
//   limit    → results per page (default: 10)
//   verified → "true" | "false" to filter by verification status (optional)
// ─────────────────────────────────────────────────────────────────────────────
const getAllCompanies = async (req, res) => {
  try {
    const { page = 1, limit = 10, verified } = req.query;

    const filter = {};
    if (verified === "true")  filter.isVerifiedCompany = true;
    if (verified === "false") filter.isVerifiedCompany = false;

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    const [companies, totalCompanies] = await Promise.all([
      CompanyProfile.find(filter)
        .populate({
          path:   "userId",
          select: "email accountStatus createdAt", // owner's auth info
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      CompanyProfile.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      pagination: {
        totalCompanies,
        totalPages: Math.ceil(totalCompanies / limitNum),
        currentPage: pageNum,
        limit: limitNum,
        hasNextPage: pageNum < Math.ceil(totalCompanies / limitNum),
        hasPrevPage: pageNum > 1,
      },
      companies,
    });
  } catch (error) {
    console.error("Admin Get All Companies Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching companies.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Verify or un-verify a company
// @route   PATCH /api/v1/admin/companies/:id/verify
// @access  Private — ADMIN only
// ─────────────────────────────────────────────────────────────────────────────
const verifyCompany = async (req, res) => {
  try {
    // Allow toggling — if already verified, admin can un-verify
    const { isVerifiedCompany = true } = req.body;

    const company = await CompanyProfile.findByIdAndUpdate(
      req.params.id,
      { isVerifiedCompany },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: isVerifiedCompany
        ? "Company verified successfully."
        : "Company verification removed.",
      company,
    });
  } catch (error) {
    console.error("Admin Verify Company Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while verifying company.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all job postings (platform-wide)
// @route   GET /api/v1/admin/jobs
// @access  Private — ADMIN only
//
// Query params:
//   page   → page number (default: 1)
//   limit  → results per page (default: 10)
//   status → filter by job status (optional)
// ─────────────────────────────────────────────────────────────────────────────
const getAllJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = {};
    if (status && ["Active", "Paused", "Closed", "Draft"].includes(status)) {
      filter.status = status;
    }

    // Admin can also filter by job type
    const { isStryperJob } = req.query;
    if (isStryperJob === "true")  filter.isStryperJob = true;
    if (isStryperJob === "false") filter.isStryperJob = false;

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    const [jobs, totalJobs] = await Promise.all([
      Job.find(filter)
        .populate({
          path:   "companyId",
          select: "companyName industry location isVerifiedCompany",
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Job.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      pagination: {
        totalJobs,
        totalPages: Math.ceil(totalJobs / limitNum),
        currentPage: pageNum,
        limit: limitNum,
        hasNextPage: pageNum < Math.ceil(totalJobs / limitNum),
        hasPrevPage: pageNum > 1,
      },
      jobs,
    });
  } catch (error) {
    console.error("Admin Get All Jobs Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching jobs.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update any job's status (admin override)
// @route   PATCH /api/v1/admin/jobs/:id/status
// @access  Private — ADMIN only
// ─────────────────────────────────────────────────────────────────────────────
const updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !["Active", "Paused", "Closed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Allowed values: Active, Paused, Closed.",
      });
    }

    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Job status updated to "${status}".`,
      job: { id: job._id, title: job.title, status: job.status },
    });
  } catch (error) {
    console.error("Admin Update Job Status Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while updating job status.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete a job and all linked applications + interviews
// @route   DELETE /api/v1/admin/jobs/:id
// @access  Private — ADMIN only
// ─────────────────────────────────────────────────────────────────────────────
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    // Cascade: find applications → delete interviews → delete applications → delete job
    const applications = await JobApplication.find({ jobId: job._id }, "_id");
    const appIds = applications.map((a) => a._id);

    await Promise.all([
      Interview.deleteMany({ applicationId: { $in: appIds } }),
      JobApplication.deleteMany({ jobId: job._id }),
      SavedJob.deleteMany({ jobId: job._id }),
      Job.findByIdAndDelete(job._id),
    ]);

    return res.status(200).json({
      success: true,
      message: "Job and all linked applications deleted successfully.",
    });
  } catch (error) {
    console.error("Admin Delete Job Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting job.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all job applications platform-wide
// @route   GET /api/v1/admin/applications
// @access  Private — ADMIN only
//
// Query params:
//   page   → page number (default: 1)
//   limit  → results per page (default: 10)
//   status → filter by pipeline status (optional)
// ─────────────────────────────────────────────────────────────────────────────
const getAllApplications = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = {};
    if (status && ["Applied", "Screening", "Interview", "Offer", "Hired", "Rejected"].includes(status)) {
      filter.status = status;
    }

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    const [applications, totalApplications] = await Promise.all([
      JobApplication.find(filter)
        .populate({ path: "candidateId", select: "fullName phone location experienceLevel" })
        .populate({ path: "companyId",   select: "companyName industry location" })
        .populate({ path: "jobId",       select: "title department location employmentType" })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      JobApplication.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      pagination: {
        totalApplications,
        totalPages: Math.ceil(totalApplications / limitNum),
        currentPage: pageNum,
        limit: limitNum,
        hasNextPage: pageNum < Math.ceil(totalApplications / limitNum),
        hasPrevPage: pageNum > 1,
      },
      applications,
    });
  } catch (error) {
    console.error("Admin Get All Applications Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching applications.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Mark or unmark an existing company as a Stryper Partner
// @route   PATCH /api/v1/admin/companies/:id/partner
// @access  Private — ADMIN only
// ─────────────────────────────────────────────────────────────────────────────
const markAsPartner = async (req, res) => {
  try {
    const { isStryperPartner = true, partnerSpecialty, partnerRating, activeHires } = req.body;

    const updateData = {
      isStryperPartner,
      // Set partnerSince to now when promoting, clear it when removing
      partnerSince:     isStryperPartner ? new Date() : null,
      partnerSpecialty: partnerSpecialty || "",
    };

    if (partnerRating !== undefined) updateData.partnerRating = partnerRating;
    if (activeHires   !== undefined) updateData.activeHires   = activeHires;

    const company = await CompanyProfile.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: isStryperPartner
        ? "Company is now a Stryper Partner."
        : "Company removed from Stryper Partners.",
      company,
    });
  } catch (error) {
    console.error("Admin Mark Partner Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while updating partner status.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Add a new partner directly from admin panel
//          Creates a CompanyProfile entry without requiring a User account.
//          Used when admin wants to add a recruitment partner that is not
//          yet registered on the platform.
// @route   POST /api/v1/admin/partners/add
// @access  Private — ADMIN only
// ─────────────────────────────────────────────────────────────────────────────
const addDirectPartner = async (req, res) => {
  try {
    const {
      companyName,
      industry,
      companySize,
      companyDescription,
      email,
      phone,
      location,
      website,
      linkedin,
      hrName,
      partnerSpecialty,
      partnerRating,
      activeHires,
    } = req.body;

    // 1. Validate required fields for a partner entry
    if (!companyName || !industry || !email) {
      return res.status(400).json({
        success: false,
        message: "companyName, industry, and email are required.",
      });
    }

    // 2. Prevent duplicate partner by email
    const existing = await CompanyProfile.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "A company with this email already exists.",
      });
    }

    // 3. Create the partner profile
    //    userId is null — this partner was added directly by admin, not via registration
    const partner = await CompanyProfile.create({
      userId:           null,
      companyName,
      industry,
      companySize:       companySize       || "N/A",
      companyDescription: companyDescription || "",
      email:             email.toLowerCase().trim(),
      phone:             phone             || "",
      location:          location          || "",
      website:           website           || "",
      linkedin:          linkedin          || "",
      hrName:            hrName            || "",
      isStryperPartner:  true,
      isVerifiedCompany: true,
      partnerSince:      new Date(),
      partnerSpecialty:  partnerSpecialty  || "",
      partnerRating:     partnerRating     || 0,
      activeHires:       activeHires       || 0,
    });

    return res.status(201).json({
      success: true,
      message: "Stryper Partner added successfully.",
      partner,
    });
  } catch (error) {
    console.error("Add Direct Partner Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while adding partner.",
    });
  }
};

module.exports = {
  getPlatformStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllCompanies,
  verifyCompany,
  getAllJobs,
  updateJobStatus,
  deleteJob,
  getAllApplications,
  markAsPartner,
  addDirectPartner,
};
