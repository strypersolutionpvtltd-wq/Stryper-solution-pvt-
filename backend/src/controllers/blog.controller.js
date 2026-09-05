const Blog = require("../models/blog.model");

// @desc    Get all blogs (public)
// @route   GET /api/v1/blogs
// @access  Public
const getAllBlogs = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }
    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: blogs.length, blogs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single blog by slug (public)
// @route   GET /api/v1/blogs/:slug
// @access  Public
const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    return res.status(200).json({ success: true, blog });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new blog (Admin only)
// @route   POST /api/v1/blogs
// @access  Private (Admin)
const createBlog = async (req, res) => {
  try {
    const { title, category, content, image, author, readTime, status } = req.body;
    if (!title || !category || !content || !image) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const existing = await Blog.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: "Blog with this title/slug already exists" });
    }

    const blog = await Blog.create({
      title,
      slug,
      category,
      content,
      image,
      author,
      readTime,
      status,
    });
    return res.status(201).json({ success: true, blog });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update blog (Admin only)
// @route   PUT /api/v1/blogs/:id
// @access  Private (Admin)
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const { title } = req.body;
    if (title && title !== blog.title) {
      req.body.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const existing = await Blog.findOne({ slug: req.body.slug, _id: { $ne: id } });
      if (existing) {
        return res.status(400).json({ success: false, message: "Another blog with this title already exists" });
      }
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    return res.status(200).json({ success: true, blog: updatedBlog });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete blog (Admin only)
// @route   DELETE /api/v1/blogs/:id
// @access  Private (Admin)
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    await Blog.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
};
