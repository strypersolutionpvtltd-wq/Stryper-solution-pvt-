const CandidateExperience = require("../models/candidateExperience.model");
const CandidateProfile = require("../models/candidateProfile.model");

// @desc    Add experience
// @route   POST /api/v1/candidate/experience
// @access  Private (Candidate)
const addExperience = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { jobTitle, company, startDate, endDate, currentlyWorking, description, employmentType, location } = req.body;

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

    if (!jobTitle || !company || !startDate) {
      return res.status(400).json({
        success: false,
        message: "Job title, company, and start date are required",
      });
    }

    const experience = await CandidateExperience.create({
      candidateId: candidateProfile._id,
      jobTitle,
      company,
      startDate,
      endDate: currentlyWorking ? null : endDate,
      currentlyWorking: currentlyWorking || false,
      description: description || "",
      employmentType: employmentType || "Full-time",
      location: location || "",
    });

    return res.status(201).json({
      success: true,
      message: "Experience added successfully",
      experience,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add experience",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get experiences
// @route   GET /api/v1/candidate/experience
// @access  Private (Candidate)
const getExperiences = async (req, res) => {
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

    const experiences = await CandidateExperience.find({ candidateId: candidateProfile._id })
      .sort({ startDate: -1 });

    return res.status(200).json({
      success: true,
      experiences,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch experiences",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Update experience
// @route   PUT /api/v1/candidate/experience/:id
// @access  Private (Candidate)
const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const updates = req.body;

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

    const experience = await CandidateExperience.findOne({
      _id: id,
      candidateId: candidateProfile._id,
    });

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    const updatedExperience = await CandidateExperience.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Experience updated successfully",
      experience: updatedExperience,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update experience",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Delete experience
// @route   DELETE /api/v1/candidate/experience/:id
// @access  Private (Candidate)
const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;
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

    const experience = await CandidateExperience.findOne({
      _id: id,
      candidateId: candidateProfile._id,
    });

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    await CandidateExperience.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Experience deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete experience",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  addExperience,
  getExperiences,
  updateExperience,
  deleteExperience,
};
