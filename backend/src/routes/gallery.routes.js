const express = require("express");
const {
  getAllGallery,
  createGallery,
  updateGallery,
  deleteGallery,
} = require("../controllers/gallery.controller");
const { protect, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

// Public routes
router.get("/", getAllGallery);

// Private Admin routes
router.post("/", protect, authorizeRoles("ADMIN"), createGallery);
router.put("/:id", protect, authorizeRoles("ADMIN"), updateGallery);
router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteGallery);

module.exports = router;
