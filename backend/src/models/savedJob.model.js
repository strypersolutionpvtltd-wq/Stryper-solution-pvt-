const mongoose = require("mongoose");

/**
 * SavedJob Model
 * --------------
 * ARCHITECTURE:
 * - Represents a candidate bookmarking a job for later
 * - Compound unique index on (candidateId + jobId) prevents saving same job twice
 * - Intentionally lightweight — only stores the relationship + timestamp
 * - Job details are fetched via populate() when needed
 *
 * Relations:
 *   SavedJob.candidateId → CandidateProfile._id
 *   SavedJob.jobId       → Job._id
 */

const savedJobSchema = new mongoose.Schema(
  {
    // FK → candidate_profiles.id
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CandidateProfile",
      required: true,
    },

    // FK → jobs.id
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
  },
  {
    timestamps: true, // createdAt = when the job was saved
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// INDEXES
// ─────────────────────────────────────────────────────────────────────────────

// UNIQUE — one candidate cannot save the same job more than once
// Enforced at DB level as a safety net beyond application logic
savedJobSchema.index({ candidateId: 1, jobId: 1 }, { unique: true });

// Fetch all saved jobs for a candidate quickly
savedJobSchema.index({ candidateId: 1 });

// ─────────────────────────────────────────────────────────────────────────────
const SavedJob = mongoose.model("SavedJob", savedJobSchema);

module.exports = SavedJob;
