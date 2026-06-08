const mongoose = require("mongoose");

/**
 * Job Model
 * ---------
 * ARCHITECTURE:
 * - Linked to CompanyProfile via companyId (not User directly)
 * - One company can post many jobs
 * - slug is auto-generated from title (used in public URLs)
 * - status "Draft" = saved but not live, "Active" = publicly visible
 *
 * Future connections:
 * - JobApplication.jobId → Job._id
 * - SavedJob.jobId       → Job._id
 * - Public /jobs page    → queries status: "Active"
 * - Hire Zone Manage Jobs → queries companyId
 */

const jobSchema = new mongoose.Schema(
  {
    // ── Ownership ─────────────────────────────────────────
    // Which company posted this job
    // Relation: Job.companyId → CompanyProfile._id
    // NOTE: companyId is optional for Stryper internal jobs (isStryperJob: true)
    // External company jobs must always have companyId
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyProfile",
      default: null,
    },

    // ── Stryper Internal Job Flag ─────────────────────────
    // true  → posted by Stryper Solution itself (shown on Careers page)
    // false → posted by an external company (shown on public Jobs page)
    // This is the only field that separates the two job types
    // Admin sets this to true when posting Stryper's own vacancies
    isStryperJob: {
      type: Boolean,
      default: false,
    },

    // ── Basic Info ────────────────────────────────────────
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // URL-friendly version of title — auto-generated in pre-save hook
    // Example: "Senior React Developer" → "senior-react-developer"
    // Used for clean public job URLs: /jobs/senior-react-developer
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Standard department (Engineering, Design, HR, etc.)
    department: {
      type: String,
      trim: true,
      default: "",
    },

    // Used when company selects "Other" in department dropdown
    customDepartment: {
      type: String,
      trim: true,
      default: "",
    },

    // ── Job Content ───────────────────────────────────────
    jobDescription: {
      type: String,
      required: true,
      trim: true,
    },

    // Array of requirement strings — e.g. ["3+ years React", "Strong TypeScript skills"]
    requirements: {
      type: [String],
      default: [],
    },

    // Array of responsibility strings — e.g. ["Lead frontend team", "Code reviews"]
    responsibilities: {
      type: [String],
      default: [],
    },

    // Array of perk strings — e.g. ["Health insurance", "Remote-friendly", "Stock options"]
    perks: {
      type: [String],
      default: [],
    },

    // ── Job Type ──────────────────────────────────────────
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Freelance"],
      required: true,
    },

    experienceLevel: {
      type: String,
      enum: ["0-1 Years", "1-3 Years", "3-5 Years", "5-8 Years", "8+ Years"],
      required: true,
    },

    // ── Compensation ──────────────────────────────────────
    // Monthly salary range in INR — both optional (company may hide salary)
    salaryMin: {
      type: Number,
      default: null,
    },

    salaryMax: {
      type: Number,
      default: null,
    },

    // ── Location ──────────────────────────────────────────
    location: {
      type: String,
      trim: true,
      default: "",
    },

    // If true, job is fully remote regardless of location field
    isRemote: {
      type: Boolean,
      default: false,
    },

    // ── Skills ────────────────────────────────────────────
    // Array of skill tags — e.g. ["React.js", "Node.js", "TypeScript"]
    skillsRequired: {
      type: [String],
      default: [],
    },

    // ── Hiring Details ────────────────────────────────────
    // Number of open positions for this role
    vacancies: {
      type: Number,
      default: 1,
      min: 1,
    },

    // Last date candidates can apply — null means no deadline
    applicationDeadline: {
      type: Date,
      default: null,
    },

    // ── Status ────────────────────────────────────────────
    // Draft  → saved but not visible publicly (default when saving draft)
    // Active → live on public jobs page, accepting applications
    // Paused → hidden temporarily, not accepting new applications
    // Closed → hiring done or manually closed, no more applications
    status: {
      type: String,
      enum: ["Active", "Paused", "Closed", "Draft"],
      default: "Draft",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// INDEXES
// ─────────────────────────────────────────────────────────────────────────────

// Public jobs page: filter by status → fetch only Active jobs quickly
jobSchema.index({ status: 1 });

// Company's Manage Jobs page: fetch all jobs by a specific company
jobSchema.index({ companyId: 1 });

// Combined: most common query — company's jobs by status (e.g. Active jobs of company X)
jobSchema.index({ companyId: 1, status: 1 });

// Public search: filter by location and employment type
jobSchema.index({ location: 1, employmentType: 1 });

// Stryper internal jobs — Careers page query
jobSchema.index({ isStryperJob: 1, status: 1 });

// ─────────────────────────────────────────────────────────────────────────────
// PRE-SAVE HOOK — Auto-generate slug from title
// Runs automatically before every .save() call
// Slug is regenerated only when title changes
// ─────────────────────────────────────────────────────────────────────────────
// NOTE: Mongoose 7+ async pre-save hooks must NOT use the next() parameter.
// With async/await, simply return to exit early — calling next() will throw
// "next is not a function" because Mongoose handles the Promise automatically.
jobSchema.pre("save", async function () {
  // Only regenerate slug if title has changed or this is a new document
  if (!this.isModified("title") && !this.isNew) return;

  // Convert title to URL-friendly slug
  // "Senior React Developer!" → "senior-react-developer"
  let baseSlug = this.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // remove special characters
    .replace(/\s+/g, "-")          // spaces → hyphens
    .replace(/-+/g, "-")           // collapse multiple hyphens
    .trim();

  // Ensure slug is unique — append short timestamp suffix if slug already exists
  let slug = baseSlug;
  const existing = await mongoose.model("Job").findOne({
    slug,
    _id: { $ne: this._id }, // exclude current document when updating
  });

  if (existing) {
    // Append last 6 digits of timestamp to make it unique
    slug = `${baseSlug}-${Date.now().toString().slice(-6)}`;
  }

  this.slug = slug;
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
