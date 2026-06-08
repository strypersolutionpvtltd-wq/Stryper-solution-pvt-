const express = require("express");
const {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  withdrawApplication,
} = require("../controllers/jobApplication.controller");
const { protect, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// CANDIDATE ROUTES
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/v1/applications — submit a job application
router.post(
  "/",
  protect,
  authorizeRoles("CANDIDATE"),
  applyForJob
);

// GET /api/v1/applications/me — get logged-in candidate's applications
// NOTE: Must be defined before /:id to avoid "me" being treated as a Mongo ID
router.get(
  "/me",
  protect,
  authorizeRoles("CANDIDATE"),
  getMyApplications
);

// DELETE /api/v1/applications/:id — withdraw an application
router.delete(
  "/:id",
  protect,
  authorizeRoles("CANDIDATE"),
  withdrawApplication
);

// ─────────────────────────────────────────────────────────────────────────────
// COMPANY ROUTES
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/v1/applications/job/:jobId — get all applicants for a job
router.get(
  "/job/:jobId",
  protect,
  authorizeRoles("COMPANY"),
  getJobApplicants
);

// PATCH /api/v1/applications/:id/status — update pipeline stage of an application
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("COMPANY"),
  updateApplicationStatus
);

module.exports = router;
