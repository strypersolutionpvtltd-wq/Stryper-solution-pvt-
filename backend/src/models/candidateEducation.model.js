const mongoose = require("mongoose");

const candidateEducationSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CandidateProfile",
      required: true,
    },

    institutionName: {
      type: String,
      required: true,
      trim: true,
    },

    degree: {
      type: String,
      required: true,
      trim: true,
    },

    fieldOfStudy: {
      type: String,
      trim: true,
      default: "",
    },

    startYear: {
      type: Number,
      required: true,
    },

    endYear: {
      type: Number,
      default: null,
    },

    grade: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const CandidateEducation = mongoose.model("CandidateEducation", candidateEducationSchema);

module.exports = CandidateEducation;
