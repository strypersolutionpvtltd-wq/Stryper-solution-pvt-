const Job = require("../models/job.model");
const CompanyProfile = require("../models/companyProfile.model");

// @desc    Create a new job
// @route   POST /api/v1/jobs
// @access  Private (Company)
const createJob = async (req, res) => {
  try {
    const { title, description, requirements, responsibilities, employmentType, salaryMin, salaryMax, location, experience, skills, salaryCurrency } = req.body;
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

    if (!title || !description || !employmentType || !location) {
      return res.status(400).json({
        success: false,
        message: "Title, description, employment type, and location are required",
      });
    }

    const newJob = await Job.create({
      companyId: companyProfile._id,
      title,
      description,
      requirements: requirements || [],
      responsibilities: responsibilities || [],
      employmentType,
      salaryMin: salaryMin || null,
      salaryMax: salaryMax || null,
      salaryCurrency: salaryCurrency || "INR",
      location,
      experience: experience || "",
      skills: skills || [],
      postedBy: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      job: newJob,
    });
  } catch (error) {
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

    const filter = { status };
    if (title) filter.title = { $regex: title, $options: "i" };
    if (location) filter.location = { $regex: location, $options: "i" };

    const jobs = await Job.find(filter)
      .populate("companyId", "companyName companyLogo location")
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
    const { title, description, requirements, responsibilities, employmentType, salaryMin, salaryMax, location, experience, skills, status } = req.body;
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

    const companyProfile = await CompanyProfile.findOne({ userId });
    if (!companyProfile || job.companyId.toString() !== companyProfile._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this job",
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      {
        title: title || job.title,
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

    const companyProfile = await CompanyProfile.findOne({ userId });
    if (!companyProfile || job.companyId.toString() !== companyProfile._id.toString()) {
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
};
