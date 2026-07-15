const express = require("express");
const {
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonial.controller");
const { protect, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

// Public routes
router.get("/", getAllTestimonials);
router.post("/", createTestimonial);

// Private Admin routes
router.put("/:id", protect, authorizeRoles("ADMIN"), updateTestimonial);
router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteTestimonial);

module.exports = router;
