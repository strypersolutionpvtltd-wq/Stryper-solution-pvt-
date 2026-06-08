const mongoose = require("mongoose");

/**
 * JobApplication Model
 * --------------------
 * ARCHITECTURE:
 * - One application = one candidate applying to one specific job
 * - companyId is stored directly (denormalized) for fast company-side queries
 *   without needing to join through the Job model every time
 * - Duplicate prevention: compound unique index on (jobId + candidateId)
 *   ensures one candidate cannot apply to the same job twice at DB level
 *
 * Relations:
 *   JobApplication.jobId       → Job._id
 *   JobApplication.candidateId → CandidateProfile._id
 *   JobApplication.companyId   → CompanyProfile._id
 *
 * Future connections:
 *   Interview.applicationId → JobApplication._id
 *   Notification triggered  → on status change
 *   Company Applicants page → query by companyId or jobId
 *   Candidate Applied Jobs  → query by candidateId
 */

const jobApplicationSchema = new mongoose.Schema(
  {
    // ── Core Relations ────────────────────────────────────

    // Which job is being applied to
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    // Which candidate is applying
    // Links to CandidateProfile (not User directly — keeps auth separate)
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CandidateProfile",
      required: true,
    },

    // Which company posted this job
    // Stored here so company can query all their applicants without
    // an extra Job lookup: JobApplication.find({ companyId })
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyProfile",
      required: true,
    },

    // ── Application Content ───────────────────────────────

    // Cloudinary URL of the uploaded resume PDF/DOC
    // Set after file upload via Multer + Cloudinary middleware
    resumeUrl: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional cover letter text
    coverLetter: {
      type: String,
      trim: true,
      default: "",
    },

    // Candidate's expected salary — stored as string (e.g. "₹10–15 LPA")
    expectedSalary: {
      type: String,
      trim: true,
      default: "",
    },

    // How soon candidate can join — e.g. "Immediate", "30 Days", "2 Months"
    noticePeriod: {
      type: String,
      trim: true,
      default: "",
    },

    // Where the candidate is currently located
    currentLocation: {
      type: String,
      trim: true,
      default: "",
    },

    // ── Hiring Pipeline Status ────────────────────────────
    // Tracks where the candidate is in the hiring process
    // Only company can update this field
    //
    // Flow:
    //   Applied → Screening → Interview → Offer → Hired
    //                                           ↘ Rejected (at any stage)
    status: {
      type: String,
      enum: ["Applied", "Screening", "Interview", "Offer", "Hired", "Rejected"],
      default: "Applied",
    },
  },
  {
    timestamps: true, // createdAt = application date, updatedAt = last stage change
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// INDEXES
// ─────────────────────────────────────────────────────────────────────────────

// UNIQUE — prevents one candidate from applying to the same job twice
// This is enforced at the database level, not just application logic
jobApplicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

// Candidate's "Applied Jobs" page — fetch all applications by a candidate
jobApplicationSchema.index({ candidateId: 1 });

// Company's "Applicants" page — fetch all applicants for a company
jobApplicationSchema.index({ companyId: 1 });

// Company filtering applicants by job — e.g. "Show applicants for Job X"
jobApplicationSchema.index({ jobId: 1, companyId: 1 });

// Filter by pipeline status — e.g. fetch all "Interview" stage candidates
jobApplicationSchema.index({ status: 1 });

// ─────────────────────────────────────────────────────────────────────────────
const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);

module.exports = JobApplication;
