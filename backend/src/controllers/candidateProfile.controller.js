const CandidateProfile = require("../models/candidateProfile.model");

// @desc    Create candidate profile
// @route   POST /api/v1/candidate/create
// @access  Private (CANDIDATE only)
const createCandidateProfile = async (req, res) => {
  try {
    // Prevent duplicate profile
    const existing = await CandidateProfile.findOne({ userId: req.user.id });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Candidate profile already exists. Use update instead.",
      });
    }

    const profile = await CandidateProfile.create({
      userId: req.user.id,
      ...req.body,
    });

    return res.status(201).json({
      success: true,
      message: "Candidate profile created successfully",
      candidateProfile: profile,
    });
  } catch (error) {
    console.error("Create Candidate Profile Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while creating candidate profile",
    });
  }
};

// @desc    Get my candidate profile
// @route   GET /api/v1/candidate/me
// @access  Private (CANDIDATE only)
const getMyCandidateProfile = async (req, res) => {
  try {
    const profile = await CandidateProfile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found. Please create your profile first.",
      });
    }

    return res.status(200).json({
      success: true,
      candidateProfile: profile,
    });
  } catch (error) {
    console.error("Get Candidate Profile Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching candidate profile",
    });
  }
};

// @desc    Update candidate profile
// @route   PUT /api/v1/candidate/update
// @access  Private (CANDIDATE only)
const updateCandidateProfile = async (req, res) => {
  try {
    const updated = await CandidateProfile.findOneAndUpdate(
      { userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found. Please create your profile first.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Candidate profile updated successfully",
      candidateProfile: updated,
    });
  } catch (error) {
    console.error("Update Candidate Profile Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while updating candidate profile",
    });
  }
};

module.exports = {
  createCandidateProfile,
  getMyCandidateProfile,
  updateCandidateProfile,
};
