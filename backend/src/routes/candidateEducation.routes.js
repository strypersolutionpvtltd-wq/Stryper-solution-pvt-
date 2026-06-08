const express = require("express");
const router = express.Router();

const { protect, authorizeRoles } = require("../middleware/auth.middleware");
const {
  addEducation,
  getMyEducation,
  updateEducation,
  deleteEducation,
} = require("../controllers/candidateEducation.controller");

// All routes below are protected and restricted to CANDIDATE role only

// POST /api/v1/candidate/education/add
router.post("/add", protect, authorizeRoles("CANDIDATE"), addEducation);

// GET /api/v1/candidate/education/me
router.get("/me", protect, authorizeRoles("CANDIDATE"), getMyEducation);

// PUT /api/v1/candidate/education/:id
router.put("/:id", protect, authorizeRoles("CANDIDATE"), updateEducation);

// DELETE /api/v1/candidate/education/:id
router.delete("/:id", protect, authorizeRoles("CANDIDATE"), deleteEducation);

module.exports = router;
