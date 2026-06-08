const express = require("express");
const { protect, authorizeRoles } = require("../middleware/auth.middleware");
const {
  uploadResume,
  uploadProfilePicture,
  uploadCompanyLogo,
} = require("../controllers/upload.controller");
const {
  uploadResume:    resumeUpload,
  uploadProfilePic: profilePicUpload,
  uploadLogo:      logoUpload,
  handleUploadError,
} = require("../middleware/upload.middleware");

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// Route middleware execution order for every upload route:
//
//   1. protect          → verify JWT token
//   2. authorizeRoles   → check user role
//   3. handleUploadError(multerInstance.single("fieldName"))
//                       → upload file to Cloudinary, handle errors cleanly
//   4. controller       → read req.file, return Cloudinary URL
//
// Field names must match what the frontend sends in FormData:
//   resume           → for resume upload
//   profilePicture   → for profile picture upload
//   companyLogo      → for company logo upload
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/v1/upload/resume
// Accepts: PDF, DOC, DOCX — max 10 MB
router.post(
  "/resume",
  protect,
  authorizeRoles("CANDIDATE"),
  handleUploadError(resumeUpload.single("resume")),
  uploadResume
);

// POST /api/v1/upload/profile-picture
// Accepts: JPG, JPEG, PNG, WEBP — max 5 MB — auto face-crop 400x400
router.post(
  "/profile-picture",
  protect,
  authorizeRoles("CANDIDATE"),
  handleUploadError(profilePicUpload.single("profilePicture")),
  uploadProfilePicture
);

// POST /api/v1/upload/company-logo
// Accepts: JPG, JPEG, PNG, WEBP, SVG — max 5 MB
router.post(
  "/company-logo",
  protect,
  authorizeRoles("COMPANY"),
  handleUploadError(logoUpload.single("companyLogo")),
  uploadCompanyLogo
);

module.exports = router;
