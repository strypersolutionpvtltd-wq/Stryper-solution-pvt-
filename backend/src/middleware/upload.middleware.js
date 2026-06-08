const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE PICTURE STORAGE
// Folder : stryper/profiles
// Allowed: jpg, jpeg, png, webp
// Max size: 5 MB
// ─────────────────────────────────────────────────────────────────────────────
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         "stryper/profiles",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      // Auto-resize to 400×400, crop to face if detected
      { width: 400, height: 400, crop: "fill", gravity: "face" },
      // Auto quality + format for smaller file size
      { quality: "auto", fetch_format: "auto" },
    ],
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// COMPANY LOGO STORAGE
// Folder : stryper/logos
// Allowed: jpg, jpeg, png, webp, svg
// Max size: 5 MB
// ─────────────────────────────────────────────────────────────────────────────
const logoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          "stryper/logos",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "svg"],
    transformation: [
      { width: 400, height: 400, crop: "limit" },
      { quality: "auto", fetch_format: "auto" },
    ],
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// RESUME STORAGE
// Folder : stryper/resumes
// Allowed: pdf, doc, docx
// Max size: 10 MB
//
// WHY resource_type "raw"?
//   Cloudinary processes "image" uploads by default. PDFs and Word docs are
//   not images — using "raw" stores them as-is without any transformation.
//   Without this, uploads fail or return broken URLs.
//
// WHY preserve extension in public_id?
//   Cloudinary raw URLs do NOT append extension automatically. If public_id
//   has no extension the URL looks like:
//     .../raw/upload/v123/stryper/resumes/xk29ab   ← 404 or wrong MIME type
//   With extension embedded in public_id:
//     .../raw/upload/v123/stryper/resumes/xk29ab.pdf  ← browser opens correctly
//
// WHY params as a function?
//   multer-storage-cloudinary supports params as async (req, file) function
//   so we can read the original filename and extract its extension dynamically
//   per upload, instead of a static config object.
// ─────────────────────────────────────────────────────────────────────────────
const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Extract original extension — e.g. "pdf", "docx"
    const ext = file.originalname.split(".").pop().toLowerCase();

    // Build unique public_id WITH extension included
    // e.g. "1749123456789_k3f7x2a.pdf"
    // This makes the Cloudinary URL end in ".pdf" so browsers open it correctly
    const uniqueName = `${Date.now()}_${Math.random().toString(36).slice(2, 9)}.${ext}`;

    return {
      folder:        "stryper/resumes",
      resource_type: "raw",      // must be "raw" for non-image files
      public_id:     uniqueName, // extension in ID → extension in final URL
    };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// FILE SIZE LIMITS
// ─────────────────────────────────────────────────────────────────────────────
const IMAGE_LIMIT = 5 * 1024 * 1024;  // 5 MB
const RESUME_LIMIT = 10 * 1024 * 1024; // 10 MB

// ─────────────────────────────────────────────────────────────────────────────
// MULTER INSTANCES
// Use these as middleware in your routes:
//
//   uploadProfilePic.single("profilePicture")
//   uploadLogo.single("companyLogo")
//   uploadResume.single("resume")
// ─────────────────────────────────────────────────────────────────────────────
const uploadProfilePic = multer({
  storage: profileStorage,
  limits:  { fileSize: IMAGE_LIMIT },
});

const uploadLogo = multer({
  storage: logoStorage,
  limits:  { fileSize: IMAGE_LIMIT },
});

const uploadResume = multer({
  storage: resumeStorage,
  limits:  { fileSize: RESUME_LIMIT },
  // Validate file type at multer level (since allowed_formats is not in params)
  // Rejects non-PDF/DOC/DOCX files before they reach Cloudinary
  fileFilter: (req, file, cb) => {
    const allowed = ["application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF, DOC, and DOCX files are allowed."), false);
    }
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// MULTER ERROR HANDLER
// Wrap this around any route that uses upload middleware.
// Usage: handleUploadError(uploadProfilePic.single("profilePicture"))
// ─────────────────────────────────────────────────────────────────────────────
const handleUploadError = (uploadMiddleware) => {
  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (!err) return next();

      // File too large
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File is too large. Maximum allowed size is 10MB.",
        });
      }

      // Wrong file type (from Cloudinary)
      if (err.message && err.message.includes("Invalid file")) {
        return res.status(400).json({
          success: false,
          message: "Invalid file type. Please upload a supported format.",
        });
      }

      // Generic multer/upload error
      return res.status(400).json({
        success: false,
        message: err.message || "File upload failed. Please try again.",
      });
    });
  };
};

module.exports = {
  uploadProfilePic,
  uploadLogo,
  uploadResume,
  handleUploadError,
};
