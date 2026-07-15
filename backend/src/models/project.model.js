const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
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
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      default: "India",
    },
    year: {
      type: String,
      default: "2026",
    },
    client: {
      type: String,
      default: "Stryper Client",
    },
    area: {
      type: String,
      default: "Varies",
    },
    duration: {
      type: String,
      default: "12 Months",
    },
    features: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Draft", "Completed"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for faster search queries
projectSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Project", projectSchema);
