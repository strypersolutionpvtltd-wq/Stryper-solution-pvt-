const express = require("express");
const {
  getCandidateProfile,
  createCandidateProfile,
  updateCandidateProfile,
} = require("../controllers/candidateProfile.controller");
const { protect: authMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

// Private routes (authenticated)
router.get("/", authMiddleware, getCandidateProfile);
router.post("/create", authMiddleware, createCandidateProfile);
router.put("/", authMiddleware, updateCandidateProfile);

module.exports = router;
