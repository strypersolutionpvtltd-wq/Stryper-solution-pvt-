const Job = require("../models/job.model");
const CompanyProfile = require("../models/companyProfile.model");
const User = require("../models/user.model");

// @desc    Create a new job
// @route   POST /api/v1/jobs
// @access  Private (Company)
const createJob = async (req, res) => {
  try {
    const { title, description, requirements, responsibilities, employmentType, salaryMin, salaryMax, location, experience, skills, salaryCurrency, status, workMode, department, deadline, openings, isStryper } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // For drafts, only title is required. For published jobs, validate all required fields
    if (status !== 'Draft') {
      if (!title || !description || !employmentType || !location) {
        return res.status(400).json({
          success: false,
          message: "Title, description, employment type, and location are required for published jobs",
        });
      }
    } else {
      // Draft validation - only title required
      if (!title || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Job title is required",
        });
      }
    }

    let companyProfile = await CompanyProfile.findOne({ userId });

    // If company profile doesn't exist, auto-create one using the user's real email
    if (!companyProfile) {
      const user = await User.findById(userId).select("email");
      const userEmail = user?.email || "contact@company.com";

      try {
        companyProfile = await CompanyProfile.create({
          userId,
          companyName: "My Company",
          industry: "Other",
          companySize: "1-50",
          companyDescription: "Company description pending",
          email: userEmail,
        });
      } catch (createError) {
        console.error("Error creating default company profile:", createError);
        return res.status(500).json({
          success: false,
          message: "Unable to create company profile. Please complete your Company Profile first.",
          error: process.env.NODE_ENV === "development" ? createError.message : undefined,
        });
      }
    }

    const newJob = await Job.create({
      companyId: companyProfile._id,
      title: title || "Untitled Job",
      department: department || "",
      description: description || "",
      requirements: requirements || [],
      responsibilities: responsibilities || [],
      employmentType: employmentType || "Full-time",
      salaryMin: salaryMin || null,
      salaryMax: salaryMax || null,
      salaryCurrency: salaryCurrency || "INR",
      location: location || "",
      experience: experience || "",
      skills: skills || [],
      status: status || "Draft",
      workMode: workMode || "On-site",
      deadline: deadline || null,
      openings: openings ? parseInt(openings) : 1,
      postedBy: userId,
      isStryper: isStryper === true || isStryper === "true",
    });

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      job: newJob,
    });
  } catch (error) {
    console.error("Create Job Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create job",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get all jobs (public)
// @route   GET /api/v1/jobs
// @access  Public
const getAllJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, title, location, status = "Active" } = req.query;

    // Query only public companies
    const publicCompanies = await CompanyProfile.find({ profileVisible: { $ne: false } }).select("_id");
    const publicCompanyIds = publicCompanies.map(c => c._id);

    const filter = { status, companyId: { $in: publicCompanyIds } };
    if (title) filter.title = { $regex: title, $options: "i" };
    if (location) filter.location = { $regex: location, $options: "i" };
    // Exclude Stryper internal jobs — show only where isStryper is false OR not set
    filter.$or = [{ isStryper: false }, { isStryper: { $exists: false } }, { isStryper: null }];

    const jobs = await Job.find(filter)
      .populate("companyId", "companyName companyLogo location profileVisible")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    // Filter out jobs from private companies (profileVisible === false)
    const visibleJobs = jobs.filter(j => j.companyId?.profileVisible !== false);
    const total = visibleJobs.length;

    return res.status(200).json({
      success: true,
      jobs: visibleJobs,
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

// @desc    Get job by ID
// @route   GET /api/v1/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id)
      .populate("companyId", "companyName companyLogo website linkedin location email phone")
      .populate("postedBy", "email");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch job",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get company jobs
// @route   GET /api/v1/jobs/company/mine
// @access  Private (Company)
const getCompanyJobs = async (req, res) => {
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

    const jobs = await Job.find({ companyId: companyProfile._id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Update job
// @route   PUT /api/v1/jobs/:id
// @access  Private (Company owner)
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, requirements, responsibilities, employmentType, salaryMin, salaryMax, location, experience, skills, status, workMode, department, deadline, openings } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const userObj = await User.findById(userId);
    const isAdmin = userObj && userObj.role === "ADMIN";

    const companyProfile = await CompanyProfile.findOne({ userId });
    if (!isAdmin && (!companyProfile || job.companyId.toString() !== companyProfile._id.toString())) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this job",
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      {
        title: title || job.title,
        department: department !== undefined ? department : job.department,
        description: description || job.description,
        requirements: requirements || job.requirements,
        responsibilities: responsibilities || job.responsibilities,
        employmentType: employmentType || job.employmentType,
        salaryMin: salaryMin !== undefined ? salaryMin : job.salaryMin,
        salaryMax: salaryMax !== undefined ? salaryMax : job.salaryMax,
        location: location || job.location,
        experience: experience !== undefined ? experience : job.experience,
        skills: skills || job.skills,
        status: status || job.status,
        workMode: workMode || job.workMode,
        deadline: deadline !== undefined ? deadline : job.deadline,
        openings: openings !== undefined ? parseInt(openings) : job.openings,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update job",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/v1/jobs/:id
// @access  Private (Company owner)
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const userObj = await User.findById(userId);
    const isAdmin = userObj && userObj.role === "ADMIN";

    const companyProfile = await CompanyProfile.findOne({ userId });
    if (!isAdmin && (!companyProfile || job.companyId.toString() !== companyProfile._id.toString())) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this job",
      });
    }

    await Job.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete job",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  getCompanyJobs,
  updateJob,
  deleteJob,
  getStryperJobs,
  applyStryperJob,
};

// @desc    Get all active Stryper internal jobs (for /careers page)
// @route   GET /api/v1/jobs/stryper
// @access  Public
async function getStryperJobs(req, res) {
  try {
    const jobs = await Job.find({ isStryper: true, status: "Active" })
      .select("title department location experience employmentType workMode description skills requirements deadline createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, jobs });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Stryper jobs",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

// @desc    Apply for a Stryper internal job (guest — no auth required)
// @route   POST /api/v1/jobs/stryper/apply
// @access  Public
async function applyStryperJob(req, res) {
  try {
    const { jobId, name, email, phone, resumeUrl, coverLetter } = req.body;

    if (!jobId || !name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Job ID, name, email, and phone are required",
      });
    }

    const job = await Job.findById(jobId);
    if (!job || !job.isStryper) {
      return res.status(404).json({ success: false, message: "Stryper job not found" });
    }

    // Find or create a dummy companyId for Stryper — use admin user's company profile
    let stryperCompany = await CompanyProfile.findOne({ companyName: /stryper/i });
    if (!stryperCompany) {
      // Fallback: use the job's companyId
      stryperCompany = { _id: job.companyId };
    }

    // Use a placeholder candidateId for guest applications — store in notes
    const JobApplication = require("../models/jobApplication.model");
    const User = require("../models/user.model");

    // Check if same email already applied for this job
    const alreadyApplied = await JobApplication.findOne({
      jobId,
      "guestInfo.email": email,
    });
    if (alreadyApplied) {
      return res.status(409).json({ success: false, message: "You have already applied for this role" });
    }

    // Find admin user as placeholder userId
    const adminUser = await User.findOne({ role: "ADMIN" });

    // We'll store guest data in coverLetter/notes as JSON since model requires candidateId
    // Use a temp candidateProfile or store guest info in notes field
    const CandidateProfile = require("../models/candidateProfile.model");

    // Check if a candidate profile exists for this email
    const userWithEmail = await User.findOne({ email });
    let candidateProfile = null;
    if (userWithEmail) {
      candidateProfile = await CandidateProfile.findOne({ userId: userWithEmail._id });
    }

    // If no profile, create a minimal guest record
    if (!candidateProfile) {
      const nameParts = name.trim().split(" ");
      candidateProfile = await CandidateProfile.create({
        userId: adminUser._id,
        firstName: nameParts[0] || name,
        lastName: nameParts.slice(1).join(" ") || "",
        phone,
      });
    }

    const application = await JobApplication.create({
      jobId,
      candidateId: candidateProfile._id,
      companyId: job.companyId,
      userId: adminUser._id,
      resume: resumeUrl || "N/A",
      coverLetter: coverLetter || "",
      isStryperApplication: true,
      notes: JSON.stringify({ guestName: name, guestEmail: email, guestPhone: phone }),
    });

    await Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully! We will contact you soon.",
      applicationId: application._id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to submit application",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
