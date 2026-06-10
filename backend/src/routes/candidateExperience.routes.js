const express = require("express");
const {
  addExperience,
  getExperiences,
  updateExperience,
  deleteExperience,
} = require("../controllers/candidateExperience.controller");
const { protect: authMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

// Private routes (authenticated)
router.post("/", authMiddleware, addExperience);
router.get("/", authMiddleware, getExperiences);
router.put("/:id", authMiddleware, updateExperience);
router.delete("/:id", authMiddleware, deleteExperience);

module.exports = router;
