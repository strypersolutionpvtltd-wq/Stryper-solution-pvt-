const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyProfile",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    requirements: [{
      type: String,
      trim: true,
    }],

    responsibilities: [{
      type: String,
      trim: true,
    }],

    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Freelance", "Internship"],
      required: true,
    },

    salaryMin: {
      type: Number,
      default: null,
    },

    salaryMax: {
      type: Number,
      default: null,
    },

    salaryCurrency: {
      type: String,
      default: "INR",
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: String,
      trim: true,
      default: "",
    },

    skills: [{
      type: String,
      trim: true,
    }],

    status: {
      type: String,
      enum: ["Active", "Closed", "Draft", "Archived"],
      default: "Active",
    },

    applicationCount: {
      type: Number,
      default: 0,
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
jobSchema.index({ companyId: 1, status: 1 });
jobSchema.index({ title: "text", description: "text" });

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
