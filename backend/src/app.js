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
