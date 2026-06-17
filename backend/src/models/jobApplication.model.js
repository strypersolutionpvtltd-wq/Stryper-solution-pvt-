const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CandidateProfile",
      required: true,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyProfile",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resume: {
      type: String,
      required: true,
    },

    coverLetter: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["Applied", "Reviewed", "Shortlisted", "Rejected", "Accepted", "Withdrawn"],
      default: "Applied",
    },

    appliedDate: {
      type: Date,
      default: Date.now,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    // true = application submitted via /careers Stryper internal job
    isStryperApplication: {
      type: Boolean,
      default: false,
    },

    salaryExpectation: {
      type: Number,
      default: null,
    },

    noticePeriod: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
jobApplicationSchema.index({ jobId: 1, status: 1 });
jobApplicationSchema.index({ candidateId: 1 });
jobApplicationSchema.index({ companyId: 1 });

const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);

module.exports = JobApplication;
