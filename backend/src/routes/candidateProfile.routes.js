const express = require("express");
const {
  searchCandidates,
  getCandidateProfile,
  createCandidateProfile,
  updateCandidateProfile,
} = require("../controllers/candidateProfile.controller");
const { protect: authMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

// Company/Admin: search all candidates
router.get("/search", authMiddleware, searchCandidates);

// Private routes (authenticated)
router.get("/", authMiddleware, getCandidateProfile);
router.post("/create", authMiddleware, createCandidateProfile);
router.put("/", authMiddleware, updateCandidateProfile);

module.exports = router;
