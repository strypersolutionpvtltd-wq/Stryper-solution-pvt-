const express = require("express");
const { createJob, getAllJobs, getJobById, getCompanyJobs, updateJob, deleteJob } = require("../controllers/job.controller");
const { protect: authMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

// Public routes
router.get("/", getAllJobs);
router.get("/:id", getJobById);

// Private routes (authenticated)
router.post("/", authMiddleware, createJob);
router.get("/company/mine", authMiddleware, getCompanyJobs);
router.put("/:id", authMiddleware, updateJob);
router.delete("/:id", authMiddleware, deleteJob);

module.exports = router;
