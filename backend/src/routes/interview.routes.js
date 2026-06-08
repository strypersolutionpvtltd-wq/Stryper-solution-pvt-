const express = require("express");
const { protect, authorizeRoles } = require("../middleware/auth.middleware");
const {
  scheduleInterview,
  getCompanyInterviews,
  getCandidateInterviews,
  updateInterview,
  cancelInterview,
} = require("../controllers/interview.controller");

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// COMPANY ROUTES
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/v1/interviews — schedule a new interview
router.post(
  "/",
  protect,
  authorizeRoles("COMPANY"),
  scheduleInterview
);

// GET /api/v1/interviews/company/mine — all interviews for this company
// NOTE: defined before /:id to prevent "company" being parsed as a Mongo ID
router.get(
  "/company/mine",
  protect,
  authorizeRoles("COMPANY"),
  getCompanyInterviews
);

// PUT /api/v1/interviews/:id — update interview details
router.put(
  "/:id",
  protect,
  authorizeRoles("COMPANY"),
  updateInterview
);

// PATCH /api/v1/interviews/:id/cancel — cancel an interview
router.patch(
  "/:id/cancel",
  protect,
  authorizeRoles("COMPANY"),
  cancelInterview
);

// ─────────────────────────────────────────────────────────────────────────────
// CANDIDATE ROUTES
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/v1/interviews/candidate/mine — candidate's own interviews
// NOTE: defined before /:id for same reason as above
router.get(
  "/candidate/mine",
  protect,
  authorizeRoles("CANDIDATE"),
  getCandidateInterviews
);

module.exports = router;
