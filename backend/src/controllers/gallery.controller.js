const Gallery = require("../models/gallery.model");

// @desc    Get all gallery items (public)
// @route   GET /api/v1/gallery
// @access  Public
const getAllGallery = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }
    const galleryItems = await Gallery.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: galleryItems.length, gallery: galleryItems });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new gallery item (Admin only)
// @route   POST /api/v1/gallery
// @access  Private (Admin)
const createGallery = async (req, res) => {
  try {
    const { title, category, image } = req.body;
    if (!title || !category || !image) {
      return res.status(400).json({ success: false, message: "Title, category, and image are required" });
    }

    const galleryItem = await Gallery.create({
      title,
      category,
      image,
    });
    return res.status(201).json({ success: true, galleryItem });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update gallery item (Admin only)
// @route   PUT /api/v1/gallery/:id
// @access  Private (Admin)
const updateGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const galleryItem = await Gallery.findById(id);
    if (!galleryItem) {
      return res.status(404).json({ success: false, message: "Gallery item not found" });
    }
    const updated = await Gallery.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    return res.status(200).json({ success: true, galleryItem: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete gallery item (Admin only)
// @route   DELETE /api/v1/gallery/:id
// @access  Private (Admin)
const deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const galleryItem = await Gallery.findById(id);
    if (!galleryItem) {
      return res.status(404).json({ success: false, message: "Gallery item not found" });
    }
    await Gallery.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Gallery item deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllGallery,
  createGallery,
  updateGallery,
  deleteGallery,
};
