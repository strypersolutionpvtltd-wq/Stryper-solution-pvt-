const mongoose = require("mongoose");

const shortlistSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyProfile",
      required: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CandidateProfile",
      required: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// One company can shortlist a candidate only once
shortlistSchema.index({ companyId: 1, candidateId: 1 }, { unique: true });

module.exports = mongoose.model("Shortlist", shortlistSchema);
