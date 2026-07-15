const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      default: "Stryper Admin",
    },
    readTime: {
      type: String,
      default: "5 Min Read",
    },
    status: {
      type: String,
      enum: ["Active", "Draft", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
blogSchema.index({ title: "text", content: "text" });

module.exports = mongoose.model("Blog", blogSchema);
