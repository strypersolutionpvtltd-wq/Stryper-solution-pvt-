const express = require("express");
const router = express.Router();

const { protect, authorizeRoles } = require("../middleware/auth.middleware");
const {
  createCandidateProfile,
  getMyCandidateProfile,
  updateCandidateProfile,
} = require("../controllers/candidateProfile.controller");

// All routes below are protected and restricted to CANDIDATE role only

// POST /api/v1/candidate/create
router.post("/create", protect, authorizeRoles("CANDIDATE"), createCandidateProfile);

// GET /api/v1/candidate/me
router.get("/me", protect, authorizeRoles("CANDIDATE"), getMyCandidateProfile);

// PUT /api/v1/candidate/update
router.put("/update", protect, authorizeRoles("CANDIDATE"), updateCandidateProfile);

module.exports = router;
