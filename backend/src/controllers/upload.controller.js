const CandidateProfile = require("../models/candidateProfile.model");
const User = require("../models/user.model");

// @desc    Upload resume
// @route   POST /api/v1/upload/resume
// @access  Private (Candidate)
const uploadResume = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Auto-create minimal profile if it doesn't exist
    let candidateProfile = await CandidateProfile.findOne({ userId });
    if (!candidateProfile) {
      const user = await User.findById(userId).select("email");
      const namePart = (user?.email || 'candidate').split('@')[0];
      const parts = namePart.split('.');
      candidateProfile = await CandidateProfile.create({
        userId,
        firstName: parts[0] || 'Candidate',
        lastName:  parts[1] || '',
      });
    }

    const resumeUrl = req.file.path;

    const updatedProfile = await CandidateProfile.findByIdAndUpdate(
      candidateProfile._id,
      { resume: resumeUrl },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      resume: resumeUrl,
      profile: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to upload resume",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Upload profile picture
// @route   POST /api/v1/upload/profile-picture
// @access  Private (Candidate)
const uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const candidateProfile = await CandidateProfile.findOne({ userId });
    if (!candidateProfile) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    // Get Cloudinary URL from req.file (set by multer-storage-cloudinary)
    const picturePath = req.file.path;

    const updatedProfile = await CandidateProfile.findByIdAndUpdate(
      candidateProfile._id,
      { profilePicture: picturePath },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully",
      profilePicture: picturePath,
      profile: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to upload profile picture",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  uploadResume,
  uploadProfilePicture,
};
