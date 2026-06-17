const mongoose = require("mongoose");

const candidateProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    headline: {
      type: String,
      trim: true,
      default: "",
    },

    bio: {
      type: String,
      trim: true,
      default: "",
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    skills: [{
      type: String,
      trim: true,
    }],

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    portfolio: {
      type: String,
      trim: true,
      default: "",
    },

    linkedin: {
      type: String,
      trim: true,
      default: "",
    },

    github: {
      type: String,
      trim: true,
      default: "",
    },

    profilePicture: {
      type: String,
      default: "",
    },

    resume: {
      type: String,
      default: "",
    },

    preferredJobTitle: {
      type: String,
      trim: true,
      default: "",
    },

    totalExperience: {
      type: String,
      trim: true,
      default: "",
    },

    expectedSalary: {
      type: String,
      trim: true,
      default: "",
    },

    preferredLocation: {
      type: String,
      trim: true,
      default: "",
    },

    preferredSalary: {
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        default: 0,
      },
    },

    noticePeriod: {
      type: String,
      enum: ["Immediate", "15 days", "1 month", "2 months", "3 months"],
      default: "Immediate",
    },

    employmentType: [{
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Freelance", "Internship"],
    }],

    // --- Settings Preferences ---
    profileVisibility: {
      type: Boolean,
      default: true,
    },
    resumeVisibility: {
      type: Boolean,
      default: true,
    },
    showCurrentEmployer: {
      type: Boolean,
      default: false,
    },
    jobRecommendations: {
      type: Boolean,
      default: true,
    },
    applicationUpdates: {
      type: Boolean,
      default: true,
    },
    recruiterMessages: {
      type: Boolean,
      default: true,
    },
    profileViews: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const CandidateProfile = mongoose.model("CandidateProfile", candidateProfileSchema);

module.exports = CandidateProfile;
