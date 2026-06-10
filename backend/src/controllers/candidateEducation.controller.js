const CandidateEducation = require("../models/candidateEducation.model");
const CandidateProfile = require("../models/candidateProfile.model");

// @desc    Add education
// @route   POST /api/v1/candidate/education
// @access  Private (Candidate)
const addEducation = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { school, degree, field, startYear, endYear, grade, description, activities } = req.body;

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

    if (!school || !degree || !field || !startYear) {
      return res.status(400).json({
        success: false,
        message: "School, degree, field, and start year are required",
      });
    }

    const education = await CandidateEducation.create({
      candidateId: candidateProfile._id,
      school,
      degree,
      field,
      startYear,
      endYear: endYear || null,
      grade: grade || "",
      description: description || "",
      activities: activities || "",
    });

    return res.status(201).json({
      success: true,
      message: "Education added successfully",
      education,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add education",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get education
// @route   GET /api/v1/candidate/education
// @access  Private (Candidate)
const getEducation = async (req, res) => {
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

    const education = await CandidateEducation.find({ candidateId: candidateProfile._id })
      .sort({ startYear: -1 });

    return res.status(200).json({
      success: true,
      education,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch education",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Update education
// @route   PUT /api/v1/candidate/education/:id
// @access  Private (Candidate)
const updateEducation = async (req, res) => {
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

    const education = await CandidateEducation.findOne({
      _id: id,
      candidateId: candidateProfile._id,
    });

    if (!education) {
      return res.status(404).json({
        success: false,
        message: "Education not found",
      });
    }

    const updatedEducation = await CandidateEducation.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Education updated successfully",
      education: updatedEducation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update education",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Delete education
// @route   DELETE /api/v1/candidate/education/:id
// @access  Private (Candidate)
const deleteEducation = async (req, res) => {
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

    const education = await CandidateEducation.findOne({
      _id: id,
      candidateId: candidateProfile._id,
    });

    if (!education) {
      return res.status(404).json({
        success: false,
        message: "Education not found",
      });
    }

    await CandidateEducation.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Education deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete education",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  addEducation,
  getEducation,
  updateEducation,
  deleteEducation,
};
