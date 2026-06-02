const express = require("express");
const router = express.Router();

const { protect, authorizeRoles } = require("../middleware/auth.middleware");
const {
  addExperience,
  getMyExperiences,
  updateExperience,
  deleteExperience,
} = require("../controllers/candidateExperience.controller");

// All routes below are protected and restricted to CANDIDATE role only

// POST /api/v1/candidate/experience/add
router.post("/add", protect, authorizeRoles("CANDIDATE"), addExperience);

// GET /api/v1/candidate/experience/me
router.get("/me", protect, authorizeRoles("CANDIDATE"), getMyExperiences);

// PUT /api/v1/candidate/experience/:id
router.put("/:id", protect, authorizeRoles("CANDIDATE"), updateExperience);

// DELETE /api/v1/candidate/experience/:id
router.delete("/:id", protect, authorizeRoles("CANDIDATE"), deleteExperience);

module.exports = router;
