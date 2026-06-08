const SavedJob = require("../models/savedJob.model");
const CandidateProfile = require("../models/candidateProfile.model");
const Job = require("../models/job.model");

// ─────────────────────────────────────────────────────────────────────────────
// HELPER — get logged-in candidate's profile
// SECURITY: candidateId always comes from server, never from request body
// ─────────────────────────────────────────────────────────────────────────────
const getCandidateProfile = (userId) =>
  CandidateProfile.findOne({ userId });

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Toggle save / unsave a job
// @route   POST /api/v1/saved-jobs/:jobId
// @access  Private — CANDIDATE only
//
// Behavior:
//   Job not saved yet → save it   → 201
//   Job already saved → unsave it → 200
// ─────────────────────────────────────────────────────────────────────────────
const toggleSaveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // 1. Get the logged-in candidate's profile
    const candidate = await getCandidateProfile(req.user.id);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found. Please create your profile first.",
      });
    }

    // 2. Check the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    // 3. Check if already saved
    const existing = await SavedJob.findOne({
      candidateId: candidate._id,
      jobId,
    });

    if (existing) {
      // Already saved → unsave (delete)
      await SavedJob.findByIdAndDelete(existing._id);

      return res.status(200).json({
        success: true,
        saved:   false,
        message: "Job removed from saved list.",
      });
    }

    // Not saved yet → save it
    await SavedJob.create({
      candidateId: candidate._id,
      jobId,
    });

    return res.status(201).json({
      success: true,
      saved:   true,
      message: "Job saved successfully.",
    });
  } catch (error) {
    // DB-level duplicate key fallback (race condition safety)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Job is already saved.",
      });
    }

    console.error("Toggle Save Job Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while saving job.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all saved jobs for the logged-in candidate
// @route   GET /api/v1/saved-jobs
// @access  Private — CANDIDATE only
//
// Query params:
//   page  → page number (default: 1)
//   limit → results per page (default: 10)
// ─────────────────────────────────────────────────────────────────────────────
const getMySavedJobs = async (req, res) => {
  try {
    // 1. Get the logged-in candidate's profile
    const candidate = await getCandidateProfile(req.user.id);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found.",
      });
    }

    const { page = 1, limit = 10 } = req.query;

    // 2. Pagination
    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    // 3. Query saved jobs + populate job and company details
    const [savedJobs, totalSaved] = await Promise.all([
      SavedJob.find({ candidateId: candidate._id })
        .populate({
          path:   "jobId",
          select: "title department location employmentType experienceLevel salaryMin salaryMax status slug skillsRequired isRemote applicationDeadline",
          populate: {
            path:   "companyId",
            select: "companyName industry location companyLogo",
          },
        })
        .sort({ createdAt: -1 }) // most recently saved first
        .skip(skip)
        .limit(limitNum)
        .lean(),
      SavedJob.countDocuments({ candidateId: candidate._id }),
    ]);

    // 4. Filter out any saved jobs whose job was deleted
    const validSavedJobs = savedJobs.filter((s) => s.jobId !== null);

    const totalPages = Math.ceil(totalSaved / limitNum);

    return res.status(200).json({
      success: true,
      pagination: {
        totalSaved,
        totalPages,
        currentPage: pageNum,
        limit:       limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      savedJobs: validSavedJobs,
    });
  } catch (error) {
    console.error("Get Saved Jobs Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching saved jobs.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Remove a saved job explicitly
// @route   DELETE /api/v1/saved-jobs/:jobId
// @access  Private — CANDIDATE only
// ─────────────────────────────────────────────────────────────────────────────
const removeSavedJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // 1. Get the logged-in candidate's profile
    const candidate = await getCandidateProfile(req.user.id);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found.",
      });
    }

    // 2. Find and delete — scoped to this candidate only
    //    SECURITY: candidateId from server ensures candidate can't delete
    //    another candidate's saved job by guessing the jobId
    const deleted = await SavedJob.findOneAndDelete({
      candidateId: candidate._id,
      jobId,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Saved job not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job removed from saved list.",
    });
  } catch (error) {
    console.error("Remove Saved Job Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while removing saved job.",
    });
  }
};

module.exports = {
  toggleSaveJob,
  getMySavedJobs,
  removeSavedJob,
};
