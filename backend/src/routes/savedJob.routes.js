const express = require("express");
const { saveJob, getMySavedJobs, removeSavedJob } = require("../controllers/savedJob.controller");
const { protect: authMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

// Private routes (authenticated)
router.post("/", authMiddleware, saveJob);
router.get("/", authMiddleware, getMySavedJobs);
router.delete("/:jobId", authMiddleware, removeSavedJob);

module.exports = router;
