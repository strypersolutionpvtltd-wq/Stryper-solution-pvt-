const express = require("express");
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  updateJobStatus,
  getMyCompanyJobs,
  getStryperJobs,
} = require("../controllers/job.controller");
const { protect, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC ROUTES — No authentication required
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/v1/jobs — list all EXTERNAL company jobs (isStryperJob: false)
// Used by: Public Jobs page
router.get("/", getAllJobs);

// GET /api/v1/jobs/stryper — list all Stryper internal jobs (isStryperJob: true)
// Used by: Careers page
// NOTE: Must be defined BEFORE /:id to prevent "stryper" being parsed as a Mongo ID
router.get("/stryper", getStryperJobs);

// GET /api/v1/jobs/:id — get single job detail (works for both types)
router.get("/:id", getJobById);

// ─────────────────────────────────────────────────────────────────────────────
// PRIVATE ROUTES — COMPANY only
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/v1/jobs/company/mine — get all jobs posted by logged-in company
// NOTE: Defined before /:id so Express does not match "mine" as a job ID
router.get(
  "/company/mine",
  protect,
  authorizeRoles("COMPANY"),
  getMyCompanyJobs
);

// POST /api/v1/jobs — create a job posting
// COMPANY → external job | ADMIN → can post Stryper internal job (isStryperJob: true)
router.post(
  "/",
  protect,
  authorizeRoles("COMPANY", "ADMIN"),
  createJob
);

// PUT /api/v1/jobs/:id — update full job details (owner only)
router.put(
  "/:id",
  protect,
  authorizeRoles("COMPANY", "ADMIN"),
  updateJob
);

// PATCH /api/v1/jobs/:id/status — update job status only
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("COMPANY", "ADMIN"),
  updateJobStatus
);

// DELETE /api/v1/jobs/:id — delete a job
router.delete(
  "/:id",
  protect,
  authorizeRoles("COMPANY", "ADMIN"),
  deleteJob
);

module.exports = router;
