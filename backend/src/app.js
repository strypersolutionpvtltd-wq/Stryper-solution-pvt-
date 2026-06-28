const express = require("express");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const app = express();

// Trust proxy — required on EC2/Nginx so req.ip returns real visitor IP
app.set("trust proxy", true);

// ── Cloudinary Configuration ───────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Multer Storage Configuration ───────────────────────────────────────────
const resumeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "stryper/resumes",
    resource_type: "auto",
    allowed_formats: ["pdf", "doc", "docx"],
  },
});

const profilePictureStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "stryper/profile-pictures",
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
  },
});

const uploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const uploadProfilePicture = multer({
  storage: profilePictureStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      process.env.CLIENT_ORIGIN,
    ].filter(Boolean),
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Routes
const authRoutes = require("./routes/auth.routes");
app.use("/api/v1/auth", authRoutes);

const companyProfileRoutes = require("./routes/companyProfile.routes");
app.use("/api/v1/company", companyProfileRoutes);

const candidateProfileRoutes = require("./routes/candidateProfile.routes");
app.use("/api/v1/candidate", candidateProfileRoutes);

const candidateExperienceRoutes = require("./routes/candidateExperience.routes");
app.use("/api/v1/candidate/experience", candidateExperienceRoutes);

const candidateEducationRoutes = require("./routes/candidateEducation.routes");
app.use("/api/v1/candidate/education", candidateEducationRoutes);

const jobRoutes = require("./routes/job.routes");
app.use("/api/v1/jobs", jobRoutes);

const jobApplicationRoutes = require("./routes/jobApplication.routes");
app.use("/api/v1/applications", jobApplicationRoutes);

const { protect: authMiddleware } = require("./middleware/auth.middleware");
const { uploadResume: uploadResumeController, uploadProfilePicture: uploadProfilePictureController } = require("./controllers/upload.controller");

// Upload routes with multer middleware
app.post("/api/v1/upload/resume", authMiddleware, uploadResume.single("resume"), uploadResumeController);
app.post("/api/v1/upload/profile-picture", authMiddleware, uploadProfilePicture.single("profilePicture"), uploadProfilePictureController);

const savedJobRoutes = require("./routes/savedJob.routes");
app.use("/api/v1/saved-jobs", savedJobRoutes);

const interviewRoutes = require("./routes/interview.routes");
app.use("/api/v1/interviews", interviewRoutes);

const notificationRoutes = require("./routes/notification.routes");
app.use("/api/v1/notifications", notificationRoutes);

const adminRoutes = require("./routes/admin.routes");
app.use("/api/v1/admin", adminRoutes);

const dashboardRoutes = require("./routes/dashboard.routes");
app.use("/api/v1/dashboard", dashboardRoutes);

const contactRoutes = require("./routes/contact.routes");
app.use("/api/v1/contact", contactRoutes);

const analyticsRoutes = require("./routes/analytics.routes");
app.use("/api/v1/analytics", analyticsRoutes);

const shortlistRoutes = require("./routes/shortlist.routes");
app.use("/api/v1/shortlist", shortlistRoutes);

const settingsRoutes = require("./routes/settings.routes");
app.use("/api/v1/settings", settingsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
