const express = require("express");
const {
  getAllBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blog.controller");
const { protect, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

// Public routes
router.get("/", getAllBlogs);
router.get("/:slug", getBlogBySlug);

// Private Admin routes
router.post("/", protect, authorizeRoles("ADMIN"), createBlog);
router.put("/:id", protect, authorizeRoles("ADMIN"), updateBlog);
router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteBlog);

module.exports = router;
