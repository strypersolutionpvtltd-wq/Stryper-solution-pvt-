const CandidateExperience = require("../models/candidateExperience.model");
const CandidateProfile = require("../models/candidateProfile.model");

// Helper — get candidateProfile._id from req.user.id
// This ensures we always resolve ownership from the authenticated user
const getCandidateId = async (userId) => {
  const profile = await CandidateProfile.findOne({ userId });
  return profile ? profile._id : null;
};

// @desc    Add a new experience entry
// @route   POST /api/v1/candidate/experience/add
// @access  Private (CANDIDATE only)
const addExperience = async (req, res) => {
  try {
    const candidateId = await getCandidateId(req.user.id);

    if (!candidateId) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found. Please create your profile first.",
      });
    }

    const { companyName, role, employmentType, startDate, endDate, currentlyWorking, description } = req.body;

    // Validate required fields
    if (!companyName || !role || !startDate) {
      return res.status(400).json({
        success: false,
        message: "Company name, role, and start date are required.",
      });
    }

    const experience = await CandidateExperience.create({
      candidateId,
      companyName,
      role,
      employmentType,
      startDate,
      endDate: currentlyWorking ? null : endDate,
      currentlyWorking: currentlyWorking || false,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Experience added successfully",
      experience,
    });
  } catch (error) {
    console.error("Add Experience Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while adding experience",
    });
  }
};

// @desc    Get all experiences for logged-in candidate
// @route   GET /api/v1/candidate/experience/me
// @access  Private (CANDIDATE only)
const getMyExperiences = async (req, res) => {
  try {
    const candidateId = await getCandidateId(req.user.id);

    if (!candidateId) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found. Please create your profile first.",
      });
    }

    const experiences = await CandidateExperience.find({ candidateId }).sort({ startDate: -1 });

    return res.status(200).json({
      success: true,
      count: experiences.length,
      experiences,
    });
  } catch (error) {
    console.error("Get Experiences Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching experiences",
    });
  }
};

// @desc    Update a specific experience entry
// @route   PUT /api/v1/candidate/experience/:id
// @access  Private (CANDIDATE only)
const updateExperience = async (req, res) => {
  try {
    const candidateId = await getCandidateId(req.user.id);

    if (!candidateId) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found.",
      });
    }

    // Find experience and verify ownership
    const experience = await CandidateExperience.findOne({
      _id: req.params.id,
      candidateId,
    });

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found or you are not authorized to update it.",
      });
    }

    const updated = await CandidateExperience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Experience updated successfully",
      experience: updated,
    });
  } catch (error) {
    console.error("Update Experience Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while updating experience",
    });
  }
};

// @desc    Delete a specific experience entry
// @route   DELETE /api/v1/candidate/experience/:id
// @access  Private (CANDIDATE only)
const deleteExperience = async (req, res) => {
  try {
    const candidateId = await getCandidateId(req.user.id);

    if (!candidateId) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found.",
      });
    }

    // Find experience and verify ownership before deleting
    const experience = await CandidateExperience.findOne({
      _id: req.params.id,
      candidateId,
    });

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found or you are not authorized to delete it.",
      });
    }

    await CandidateExperience.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Experience deleted successfully",
    });
  } catch (error) {
    console.error("Delete Experience Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting experience",
    });
  }
};

module.exports = {
  addExperience,
  getMyExperiences,
  updateExperience,
  deleteExperience,
};
