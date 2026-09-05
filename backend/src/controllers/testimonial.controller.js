const Testimonial = require("../models/testimonial.model");

// @desc    Get all testimonials (public)
// @route   GET /api/v1/testimonials
// @access  Public
const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: testimonials.length, testimonials });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new testimonial
// @route   POST /api/v1/testimonials
// @access  Public
const createTestimonial = async (req, res) => {
  try {
    const { name, role, text, rating, image } = req.body;
    if (!name || !text) {
      return res.status(400).json({ success: false, message: "Name and text are required" });
    }

    const testimonial = await Testimonial.create({
      name,
      role,
      text,
      rating,
      image,
    });
    return res.status(201).json({ success: true, testimonial });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update testimonial (Admin only)
// @route   PUT /api/v1/testimonials/:id
// @access  Private (Admin)
const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    return res.status(200).json({ success: true, testimonial: updatedTestimonial });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete testimonial (Admin only)
// @route   DELETE /api/v1/testimonials/:id
// @access  Private (Admin)
const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }
    await Testimonial.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Testimonial deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
