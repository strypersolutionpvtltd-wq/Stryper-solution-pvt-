const express = require("express");
const { protect, authorizeRoles } = require("../middleware/auth.middleware");
const {
  toggleSaveJob,
  getMySavedJobs,
  removeSavedJob,
} = require("../controllers/savedJob.controller");

const router = express.Router();

// All routes: CANDIDATE only
// GET /api/v1/saved-jobs — get all saved jobs (with pagination + populated job details)
router.get(
  "/",
  protect,
  authorizeRoles("CANDIDATE"),
  getMySavedJobs
);

// POST /api/v1/saved-jobs/:jobId — toggle save / unsave a job
router.post(
  "/:jobId",
  protect,
  authorizeRoles("CANDIDATE"),
  toggleSaveJob
);

// DELETE /api/v1/saved-jobs/:jobId — explicitly remove a saved job
router.delete(
  "/:jobId",
  protect,
  authorizeRoles("CANDIDATE"),
  removeSavedJob
);

module.exports = router;
