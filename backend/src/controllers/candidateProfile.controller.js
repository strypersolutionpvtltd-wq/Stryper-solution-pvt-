const CandidateProfile = require("../models/candidateProfile.model");

// @desc    Create or Get candidate profile
// @route   POST/GET /api/v1/candidate
// @access  Private (Candidate)
const getCandidateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const profile = await CandidateProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Create candidate profile
// @route   POST /api/v1/candidate/create
// @access  Private (Candidate)
const createCandidateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { firstName, lastName, headline, bio, location, phone, skills, portfolio, linkedin, github } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "First name and last name are required",
      });
    }

    const existingProfile = await CandidateProfile.findOne({ userId });
    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: "Candidate profile already exists",
      });
    }

    const profile = await CandidateProfile.create({
      userId,
      firstName,
      lastName,
      headline: headline || "",
      bio: bio || "",
      location: location || "",
      phone: phone || "",
      skills: skills || [],
      portfolio: portfolio || "",
      linkedin: linkedin || "",
      github: github || "",
    });

    return res.status(201).json({
      success: true,
      message: "Candidate profile created",
      profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Update candidate profile
// @route   PUT /api/v1/candidate
// @access  Private (Candidate)
const updateCandidateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    const updates = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const profile = await CandidateProfile.findOneAndUpdate(
      { userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  getCandidateProfile,
  createCandidateProfile,
  updateCandidateProfile,
};
