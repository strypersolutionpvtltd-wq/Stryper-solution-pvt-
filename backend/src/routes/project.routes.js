const express = require("express");
const {
  getAllProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/project.controller");
const { protect, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

// Public routes
router.get("/", getAllProjects);
router.get("/:slug", getProjectBySlug);

// Private Admin routes
router.post("/", protect, authorizeRoles("ADMIN"), createProject);
router.put("/:id", protect, authorizeRoles("ADMIN"), updateProject);
router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteProject);

module.exports = router;
