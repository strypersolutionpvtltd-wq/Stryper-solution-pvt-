const SavedJob = require("../models/savedJob.model");
const Job = require("../models/job.model");
const CandidateProfile = require("../models/candidateProfile.model");

// @desc    Save a job
// @route   POST /api/v1/saved-jobs
// @access  Private (Candidate)
const saveJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const candidateProfile = await CandidateProfile.findOne({ userId });
    if (!candidateProfile) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    const existingSave = await SavedJob.findOne({
      candidateId: candidateProfile._id,
      jobId,
    });

    if (existingSave) {
      return res.status(409).json({
        success: false,
        message: "Job already saved",
      });
    }

    const savedJob = await SavedJob.create({
      candidateId: candidateProfile._id,
      jobId,
      userId,
    });

    return res.status(201).json({
      success: true,
      message: "Job saved successfully",
      savedJob,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to save job",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get my saved jobs
// @route   GET /api/v1/saved-jobs
// @access  Private (Candidate)
const getMySavedJobs = async (req, res) => {
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

    const savedJobs = await SavedJob.find({ candidateId: candidateProfile._id })
      .populate("jobId", "title description salary location employmentType")
      .populate("jobId.companyId", "companyName companyLogo")
      .sort({ savedAt: -1 });

    return res.status(200).json({
      success: true,
      savedJobs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch saved jobs",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Remove saved job
// @route   DELETE /api/v1/saved-jobs/:jobId
// @access  Private (Candidate)
const removeSavedJob = async (req, res) => {
  try {
    const { jobId } = req.params;
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

    const savedJob = await SavedJob.findOne({
      candidateId: candidateProfile._id,
      jobId,
    });

    if (!savedJob) {
      return res.status(404).json({
        success: false,
        message: "Saved job not found",
      });
    }

    await SavedJob.deleteOne({
      candidateId: candidateProfile._id,
      jobId,
    });

    return res.status(200).json({
      success: true,
      message: "Job removed from saved",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to remove saved job",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  saveJob,
  getMySavedJobs,
  removeSavedJob,
};
