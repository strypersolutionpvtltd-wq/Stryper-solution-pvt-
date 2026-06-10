const express = require("express");
const {
  addEducation,
  getEducation,
  updateEducation,
  deleteEducation,
} = require("../controllers/candidateEducation.controller");
const { protect: authMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

// Private routes (authenticated)
router.post("/", authMiddleware, addEducation);
router.get("/", authMiddleware, getEducation);
router.put("/:id", authMiddleware, updateEducation);
router.delete("/:id", authMiddleware, deleteEducation);

module.exports = router;
