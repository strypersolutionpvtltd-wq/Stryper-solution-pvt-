const express = require("express");
const { createJob, getAllJobs, getJobById, getCompanyJobs, updateJob, deleteJob, getStryperJobs, applyStryperJob } = require("../controllers/job.controller");
const { protect: authMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

// Public routes — specific paths MUST come before /:id
router.get("/", getAllJobs);
router.get("/stryper", getStryperJobs);
router.post("/stryper/apply", applyStryperJob);

// Private routes
router.post("/", authMiddleware, createJob);
router.get("/company/mine", authMiddleware, getCompanyJobs);

// Parameterised routes last
router.get("/:id", getJobById);
router.put("/:id", authMiddleware, updateJob);
router.delete("/:id", authMiddleware, deleteJob);

module.exports = router;
