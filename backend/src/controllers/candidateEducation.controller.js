const CandidateEducation = require("../models/candidateEducation.model");
const CandidateProfile = require("../models/candidateProfile.model");

// Helper — resolve candidateProfile._id from authenticated user
const getCandidateId = async (userId) => {
  const profile = await CandidateProfile.findOne({ userId });
  return profile ? profile._id : null;
};

// @desc    Add a new education record
// @route   POST /api/v1/candidate/education/add
// @access  Private (CANDIDATE only)
const addEducation = async (req, res) => {
  try {
    const candidateId = await getCandidateId(req.user.id);

    if (!candidateId) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found. Please create your profile first.",
      });
    }

    const { institutionName, degree, fieldOfStudy, startYear, endYear, grade } = req.body;

    // Validate required fields
    if (!institutionName || !degree || !startYear) {
      return res.status(400).json({
        success: false,
        message: "Institution name, degree, and start year are required.",
      });
    }

    const education = await CandidateEducation.create({
      candidateId,
      institutionName,
      degree,
      fieldOfStudy,
      startYear,
      endYear: endYear || null,
      grade,
    });

    return res.status(201).json({
      success: true,
      message: "Education record added successfully",
      education,
    });
  } catch (error) {
    console.error("Add Education Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while adding education record",
    });
  }
};

// @desc    Get all education records for logged-in candidate
// @route   GET /api/v1/candidate/education/me
// @access  Private (CANDIDATE only)
const getMyEducation = async (req, res) => {
  try {
    const candidateId = await getCandidateId(req.user.id);

    if (!candidateId) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found. Please create your profile first.",
      });
    }

    const educationList = await CandidateEducation.find({ candidateId }).sort({ startYear: -1 });

    return res.status(200).json({
      success: true,
      count: educationList.length,
      education: educationList,
    });
  } catch (error) {
    console.error("Get Education Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching education records",
    });
  }
};

// @desc    Update a specific education record
// @route   PUT /api/v1/candidate/education/:id
// @access  Private (CANDIDATE only)
const updateEducation = async (req, res) => {
  try {
    const candidateId = await getCandidateId(req.user.id);

    if (!candidateId) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found.",
      });
    }

    // Verify ownership before updating
    const education = await CandidateEducation.findOne({
      _id: req.params.id,
      candidateId,
    });

    if (!education) {
      return res.status(404).json({
        success: false,
        message: "Education record not found or you are not authorized to update it.",
      });
    }

    const updated = await CandidateEducation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Education record updated successfully",
      education: updated,
    });
  } catch (error) {
    console.error("Update Education Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while updating education record",
    });
  }
};

// @desc    Delete a specific education record
// @route   DELETE /api/v1/candidate/education/:id
// @access  Private (CANDIDATE only)
const deleteEducation = async (req, res) => {
  try {
    const candidateId = await getCandidateId(req.user.id);

    if (!candidateId) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found.",
      });
    }

    // Verify ownership before deleting
    const education = await CandidateEducation.findOne({
      _id: req.params.id,
      candidateId,
    });

    if (!education) {
      return res.status(404).json({
        success: false,
        message: "Education record not found or you are not authorized to delete it.",
      });
    }

    await CandidateEducation.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Education record deleted successfully",
    });
  } catch (error) {
    console.error("Delete Education Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting education record",
    });
  }
};

module.exports = {
  addEducation,
  getMyEducation,
  updateEducation,
  deleteEducation,
};
