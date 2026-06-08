const express = require("express");
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  updateJobStatus,
  getMyCompanyJobs,
} = require("../controllers/job.controller");
const { protect, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC ROUTES — No authentication required
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/v1/jobs — list all active jobs (with search, filter, pagination)
router.get("/", getAllJobs);

// GET /api/v1/jobs/:id — get single job detail
// NOTE: This must come AFTER /company/mine to avoid "mine" being treated as an id
router.get("/:id", getJobById);

// ─────────────────────────────────────────────────────────────────────────────
// PRIVATE ROUTES — COMPANY only
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/v1/jobs/company/mine — get all jobs posted by logged-in company
// IMPORTANT: Defined before /:id so Express does not match "mine" as a job ID
router.get(
  "/company/mine",
  protect,
  authorizeRoles("COMPANY"),
  getMyCompanyJobs
);

// POST /api/v1/jobs — create a new job posting
router.post(
  "/",
  protect,
  authorizeRoles("COMPANY"),
  createJob
);

// PUT /api/v1/jobs/:id — update full job details (owner only)
router.put(
  "/:id",
  protect,
  authorizeRoles("COMPANY"),
  updateJob
);

// PATCH /api/v1/jobs/:id/status — update job status only (Active/Paused/Closed/Draft)
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("COMPANY"),
  updateJobStatus
);

// DELETE /api/v1/jobs/:id — delete a job (owner only)
router.delete(
  "/:id",
  protect,
  authorizeRoles("COMPANY"),
  deleteJob
);

module.exports = router;
