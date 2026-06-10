const express = require("express");
const {
  scheduleInterview,
  getCompanyInterviews,
  getCandidateInterviews,
  updateInterview,
  cancelInterview,
} = require("../controllers/interview.controller");
const { protect: authMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

// Private routes (authenticated)
router.post("/", authMiddleware, scheduleInterview);
router.get("/company", authMiddleware, getCompanyInterviews);
router.get("/candidate", authMiddleware, getCandidateInterviews);
router.put("/:id", authMiddleware, updateInterview);
router.delete("/:id", authMiddleware, cancelInterview);

module.exports = router;
