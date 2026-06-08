const Job = require("../models/job.model");
const CompanyProfile = require("../models/companyProfile.model");

// ─────────────────────────────────────────────────────────────────────────────
// HELPER — fetch the logged-in company's profile
// Returns null if not found — caller handles the 404 response
// ─────────────────────────────────────────────────────────────────────────────
const getCompanyProfile = async (userId) => {
  return await CompanyProfile.findOne({ userId });
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Create a new job posting
// @route   POST /api/v1/jobs
// @access  Private — COMPANY or ADMIN
//
// COMPANY → external job (isStryperJob: false, companyId from their profile)
// ADMIN   → can post Stryper internal job (isStryperJob: true, no companyId needed)
// ─────────────────────────────────────────────────────────────────────────────
const createJob = async (req, res) => {
  try {
    const {
      title,
      department,
      customDepartment,
      jobDescription,
      requirements,
      responsibilities,
      perks,
      employmentType,
      experienceLevel,
      salaryMin,
      salaryMax,
      location,
      isRemote,
      skillsRequired,
      vacancies,
      applicationDeadline,
      status,
      isStryperJob,
    } = req.body;

    // 1. Validate required fields
    if (!title || !jobDescription || !employmentType || !experienceLevel) {
      return res.status(400).json({
        success: false,
        message: "title, jobDescription, employmentType, and experienceLevel are required.",
      });
    }

    let companyId = null;
    const isInternal = req.user.role === "ADMIN" && isStryperJob === true;

    // 2. Determine companyId based on role
    //    ADMIN posting Stryper internal job → no companyId needed
    //    COMPANY posting external job → companyId from their profile (server-side)
    if (!isInternal) {
      const company = await getCompanyProfile(req.user.id);
      if (!company) {
        return res.status(404).json({
          success: false,
          message: "Company profile not found. Please create your company profile first.",
        });
      }
      companyId = company._id;
    }

    // 3. Create the job
    const job = await Job.create({
      companyId,
      isStryperJob: isInternal,
      title,
      department:       department       || "",
      customDepartment: customDepartment || "",
      jobDescription,
      requirements:     Array.isArray(requirements)     ? requirements     : [],
      responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
      perks:            Array.isArray(perks)            ? perks            : [],
      employmentType,
      experienceLevel,
      salaryMin:           salaryMin           || null,
      salaryMax:           salaryMax           || null,
      location:            location            || "",
      isRemote:            isRemote            || false,
      skillsRequired:      Array.isArray(skillsRequired) ? skillsRequired : [],
      vacancies:           vacancies           || 1,
      applicationDeadline: applicationDeadline || null,
      status: status || "Draft",
    });

    return res.status(201).json({
      success: true,
      message: "Job created successfully.",
      job,
    });
  } catch (error) {
    console.error("Create Job Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while creating job.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all public active jobs (with search, filter, pagination)
// @route   GET /api/v1/jobs
// @access  Public
//
// Query params:
//   page           → page number (default: 1)
//   limit          → results per page (default: 10, max: 50)
//   keyword        → searches title, skillsRequired, location
//   location       → exact/partial location match
//   employmentType → Full-time | Part-time | Contract | Internship | Freelance
//   experienceLevel→ 0-1 Years | 1-3 Years | 3-5 Years | 5-8 Years | 8+ Years
// ─────────────────────────────────────────────────────────────────────────────
const getAllJobs = async (req, res) => {
  try {
    const {
      page           = 1,
      limit          = 10,
      keyword,
      location,
      employmentType,
      experienceLevel,
    } = req.query;

    // 1. Build filter — restrict to Active external (non-Stryper) jobs for public route
    const filter = { status: "Active", isStryperJob: false };

    // Keyword: partial case-insensitive match on title, location, skills
    if (keyword && keyword.trim()) {
      const regex = new RegExp(keyword.trim(), "i");
      filter.$or = [
        { title:          regex },
        { location:       regex },
        { skillsRequired: regex },
        { department:     regex },
      ];
    }

    // Location: partial match (e.g. "Delhi" matches "Delhi NCR")
    if (location && location.trim()) {
      filter.location = new RegExp(location.trim(), "i");
    }

    // Employment type: exact enum match
    if (employmentType && employmentType.trim()) {
      filter.employmentType = employmentType.trim();
    }

    // Experience level: exact enum match
    if (experienceLevel && experienceLevel.trim()) {
      filter.experienceLevel = experienceLevel.trim();
    }

    // 2. Pagination — cap limit at 50 to prevent abuse
    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    // 3. Run query + count in parallel for performance
    const [jobs, totalJobs] = await Promise.all([
      Job.find(filter)
        .populate({
          path:   "companyId",
          select: "companyName industry location companyLogo companySize", // only public fields
        })
        .sort({ createdAt: -1 }) // newest first
        .skip(skip)
        .limit(limitNum)
        .lean(), // plain JS object — faster for read-only responses
      Job.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalJobs / limitNum);

    return res.status(200).json({
      success: true,
      // Pagination metadata — frontend uses this to render page controls
      pagination: {
        totalJobs,
        totalPages,
        currentPage: pageNum,
        limit:       limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      jobs,
    });
  } catch (error) {
    console.error("Get All Jobs Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching jobs.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get a single job by ID
// @route   GET /api/v1/jobs/:id
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate({
      path:   "companyId",
      select: "companyName industry location companyLogo website companySize companyDescription",
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error("Get Job By ID Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching job.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update a job posting
// @route   PUT /api/v1/jobs/:id
// @access  Private — COMPANY only (owner only)
// ─────────────────────────────────────────────────────────────────────────────
const updateJob = async (req, res) => {
  try {
    // 1. Get the logged-in company's profile
    const company = await getCompanyProfile(req.user.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found.",
      });
    }

    // 2. Find the job
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    // 3. Ownership check — only the company that posted can update
    //    Compare as strings to avoid ObjectId reference mismatch
    if (job.companyId.toString() !== company._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only update your own job postings.",
      });
    }

    // 4. Prevent overwriting companyId via request body (security)
    delete req.body.companyId;

    // 5. Update — runValidators ensures enum values are still valid
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Job updated successfully.",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Update Job Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while updating job.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete a job posting
// @route   DELETE /api/v1/jobs/:id
// @access  Private — COMPANY only (owner only)
// ─────────────────────────────────────────────────────────────────────────────
const deleteJob = async (req, res) => {
  try {
    // 1. Get logged-in company profile
    const company = await getCompanyProfile(req.user.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found.",
      });
    }

    // 2. Find the job
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    // 3. Ownership check
    if (job.companyId.toString() !== company._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only delete your own job postings.",
      });
    }

    // 4. Delete the job
    await Job.findByIdAndDelete(req.params.id);

    // NOTE: When JobApplication model is implemented, delete linked
    // applications here too: await JobApplication.deleteMany({ jobId: req.params.id })

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Job Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting job.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update job status only (Active / Paused / Closed / Draft)
// @route   PATCH /api/v1/jobs/:id/status
// @access  Private — COMPANY only (owner only)
// ─────────────────────────────────────────────────────────────────────────────
const updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // 1. Validate the status value
    const allowedStatuses = ["Active", "Paused", "Closed", "Draft"];
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

    // 3. Find the job
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    // 4. Ownership check
    if (job.companyId.toString() !== company._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only update your own job postings.",
      });
    }

    // 5. Update only the status field
    job.status = status;
    await job.save();

    return res.status(200).json({
      success: true,
      message: `Job status updated to "${status}".`,
      job: {
        id:     job._id,
        title:  job.title,
        status: job.status,
      },
    });
  } catch (error) {
    console.error("Update Job Status Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while updating job status.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all jobs posted by the logged-in company
// @route   GET /api/v1/jobs/company/mine
// @access  Private — COMPANY only
//
// Query params:
//   status → filter by status (optional)
//   page   → page number (default: 1)
//   limit  → results per page (default: 10)
// ─────────────────────────────────────────────────────────────────────────────
const getMyCompanyJobs = async (req, res) => {
  try {
    // 1. Get logged-in company profile
    const company = await getCompanyProfile(req.user.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found.",
      });
    }

    const { status, page = 1, limit = 10 } = req.query;

    // 2. Build filter — always scoped to this company
    const filter = { companyId: company._id };

    // Optionally filter by status (e.g. show only Active jobs)
    if (status && ["Active", "Paused", "Closed", "Draft"].includes(status)) {
      filter.status = status;
    }

    // 3. Pagination
    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    // 4. Run query + count in parallel
    const [jobs, totalJobs] = await Promise.all([
      Job.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Job.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalJobs / limitNum);

    return res.status(200).json({
      success: true,
      pagination: {
        totalJobs,
        totalPages,
        currentPage: pageNum,
        limit:       limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      jobs,
    });
  } catch (error) {
    console.error("Get My Company Jobs Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching your jobs.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all Stryper internal jobs (for Careers page)
// @route   GET /api/v1/jobs/stryper
// @access  Public
//
// Returns only Stryper's own job postings with status = Active
// Used exclusively by the public Careers page — never mixes with company jobs
// ─────────────────────────────────────────────────────────────────────────────
const getStryperJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, keyword, location, employmentType, experienceLevel } = req.query;

    // Always filter to Stryper internal Active jobs only
    const filter = { isStryperJob: true, status: "Active" };

    if (keyword && keyword.trim()) {
      const regex = new RegExp(keyword.trim(), "i");
      filter.$or = [
        { title:          regex },
        { location:       regex },
        { skillsRequired: regex },
        { department:     regex },
      ];
    }

    if (location && location.trim()) {
      filter.location = new RegExp(location.trim(), "i");
    }

    if (employmentType && employmentType.trim()) {
      filter.employmentType = employmentType.trim();
    }

    if (experienceLevel && experienceLevel.trim()) {
      filter.experienceLevel = experienceLevel.trim();
    }

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    const [jobs, totalJobs] = await Promise.all([
      Job.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Job.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalJobs / limitNum);

    return res.status(200).json({
      success: true,
      pagination: {
        totalJobs,
        totalPages,
        currentPage: pageNum,
        limit:       limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      jobs,
    });
  } catch (error) {
    console.error("Get Stryper Jobs Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching Stryper jobs.",
    });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  updateJobStatus,
  getMyCompanyJobs,
  getStryperJobs,
};
