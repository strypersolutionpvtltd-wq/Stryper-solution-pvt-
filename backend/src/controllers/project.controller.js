const Project = require("../models/project.model");

// @desc    Get all projects (public)
// @route   GET /api/v1/projects
// @access  Public
const getAllProjects = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }
    const projects = await Project.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: projects.length, projects });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single project by slug (public)
// @route   GET /api/v1/projects/:slug
// @access  Public
const getProjectBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const project = await Project.findOne({ slug });
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    return res.status(200).json({ success: true, project });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new project (Admin only)
// @route   POST /api/v1/projects
// @access  Private (Admin)
const createProject = async (req, res) => {
  try {
    const { title, category, description, image, images, location, year, client, area, details, status } = req.body;
    if (!title || !category || !description || !image) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const existing = await Project.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: "Project with this title/slug already exists" });
    }

    const project = await Project.create({
      title,
      slug,
      category,
      description,
      image,
      images,
      location,
      year,
      client,
      area,
      details,
      status,
    });
    return res.status(201).json({ success: true, project });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update project (Admin only)
// @route   PUT /api/v1/projects/:id
// @access  Private (Admin)
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const { title } = req.body;
    if (title && title !== project.title) {
      req.body.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const existing = await Project.findOne({ slug: req.body.slug, _id: { $ne: id } });
      if (existing) {
        return res.status(400).json({ success: false, message: "Another project with this title already exists" });
      }
    }

    const updatedProject = await Project.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    return res.status(200).json({ success: true, project: updatedProject });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete project (Admin only)
// @route   DELETE /api/v1/projects/:id
// @access  Private (Admin)
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    await Project.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
};
