const express = require("express");
const cors = require("cors");

const app = express();

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
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

const uploadRoutes = require("./routes/upload.routes");
app.use("/api/v1/upload", uploadRoutes);

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
