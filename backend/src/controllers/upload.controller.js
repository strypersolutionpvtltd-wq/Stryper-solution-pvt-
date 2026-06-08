// NOTE: File upload itself is handled by Multer + Cloudinary middleware
// in upload.routes.js — by the time these controllers run, the file is
// already uploaded to Cloudinary and req.file is populated.
// Controllers here only read req.file and return the clean response.

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Upload candidate resume (PDF / DOC / DOCX)
// @route   POST /api/v1/upload/resume
// @access  Private — CANDIDATE only
// ─────────────────────────────────────────────────────────────────────────────
const uploadResume = (req, res) => {
  try {
    // req.file is set by multer-storage-cloudinary after successful upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please attach a PDF, DOC, or DOCX file.",
      });
    }

    // req.file.path = secure Cloudinary URL (set by multer-storage-cloudinary)
    // req.file.filename = public_id on Cloudinary
    const resumeUrl = req.file.path;

    return res.status(200).json({
      success:   true,
      message:   "Resume uploaded successfully.",
      resumeUrl,
      // Return public_id so frontend can reference it if deletion is needed later
      publicId:  req.file.filename,
    });
  } catch (error) {
    console.error("Upload Resume Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while uploading resume.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Upload candidate profile picture (JPG / PNG / WEBP)
// @route   POST /api/v1/upload/profile-picture
// @access  Private — CANDIDATE only
// ─────────────────────────────────────────────────────────────────────────────
const uploadProfilePicture = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please attach a JPG, PNG, or WEBP image.",
      });
    }

    const profilePictureUrl = req.file.path;

    return res.status(200).json({
      success:           true,
      message:           "Profile picture uploaded successfully.",
      profilePictureUrl,
      publicId:          req.file.filename,
    });
  } catch (error) {
    console.error("Upload Profile Picture Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while uploading profile picture.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Upload company logo (JPG / PNG / WEBP / SVG)
// @route   POST /api/v1/upload/company-logo
// @access  Private — COMPANY only
// ─────────────────────────────────────────────────────────────────────────────
const uploadCompanyLogo = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please attach a JPG, PNG, WEBP, or SVG image.",
      });
    }

    const companyLogoUrl = req.file.path;

    return res.status(200).json({
      success:        true,
      message:        "Company logo uploaded successfully.",
      companyLogoUrl,
      publicId:       req.file.filename,
    });
  } catch (error) {
    console.error("Upload Company Logo Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while uploading company logo.",
    });
  }
};

module.exports = {
  uploadResume,
  uploadProfilePicture,
  uploadCompanyLogo,
};
