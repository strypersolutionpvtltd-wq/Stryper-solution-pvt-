const express = require("express");
const {
  getCompanyApplicants,
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  withdrawApplication,
} = require("../controllers/jobApplication.controller");
const { protect: authMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/company", authMiddleware, getCompanyApplicants);
router.post("/", authMiddleware, applyForJob);
router.get("/me", authMiddleware, getMyApplications);
router.get("/job/:jobId", authMiddleware, getJobApplicants);
router.patch("/:id/status", authMiddleware, updateApplicationStatus);
router.delete("/:id", authMiddleware, withdrawApplication);

module.exports = router;
