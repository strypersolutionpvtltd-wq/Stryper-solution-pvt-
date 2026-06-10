const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobApplication",
      required: true,
    },

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

    candidateUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    interviewDate: {
      type: Date,
      required: true,
    },

    interviewTime: {
      type: String,
      required: true,
    },

    duration: {
      type: Number,
      default: 30,
    },

    interviewType: {
      type: String,
      enum: ["Phone", "Video", "In-person", "Online Test"],
      required: true,
    },

    interviewLink: {
      type: String,
      trim: true,
      default: "",
    },

    interviewLocation: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled", "Rescheduled", "No-show"],
      default: "Scheduled",
    },

    feedback: {
      type: String,
      trim: true,
      default: "",
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

    createdBy: {
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
interviewSchema.index({ candidateUserId: 1, interviewDate: 1 });
interviewSchema.index({ companyId: 1, interviewDate: 1 });
interviewSchema.index({ status: 1 });

const Interview = mongoose.model("Interview", interviewSchema);

module.exports = Interview;
