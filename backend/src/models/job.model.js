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

    department: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      required: false,
      trim: true,
      default: "",
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
      required: false,
      default: null,
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
      required: false,
      trim: true,
      default: "",
    },

    experience: {
      type: String,
      trim: true,
      default: "",
    },

    workMode: {
      type: String,
      enum: ["On-site", "Remote", "Hybrid"],
      default: "On-site",
    },

    deadline: {
      type: Date,
      default: null,
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

    // true = Stryper internal job — shown only on /careers page, NOT in /jobs listing
    isStryper: {
      type: Boolean,
      default: false,
    },

    applicationCount: {
      type: Number,
      default: 0,
    },

    openings: {
      type: Number,
      default: 1,
      min: 1,
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
