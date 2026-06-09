const express = require("express");
const { protect, authorizeRoles } = require("../middleware/auth.middleware");
const {
  getPlatformStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllCompanies,
  verifyCompany,
  getAllJobs,
  updateJobStatus,
  deleteJob,
  getAllApplications,
  markAsPartner,
  addDirectPartner,
} = require("../controllers/admin.controller");

const router = express.Router();

// All routes: ADMIN only
const adminOnly = [protect, authorizeRoles("ADMIN")];

// ── Stats ─────────────────────────────────────────────────────────────────────
router.get("/stats", ...adminOnly, getPlatformStats);

// ── Users ─────────────────────────────────────────────────────────────────────
router.get("/users",                 ...adminOnly, getAllUsers);
router.patch("/users/:id/status",    ...adminOnly, updateUserStatus);
router.delete("/users/:id",          ...adminOnly, deleteUser);

// ── Companies ─────────────────────────────────────────────────────────────────
router.get("/companies",              ...adminOnly, getAllCompanies);
router.patch("/companies/:id/verify", ...adminOnly, verifyCompany);

// ── Stryper Partners ──────────────────────────────────────────────────────────
// Mark / unmark existing company as partner
router.patch("/companies/:id/partner", ...adminOnly, markAsPartner);
// Add a new partner directly from admin panel (no registration required)
router.post("/partners/add",           ...adminOnly, addDirectPartner);

// ── Jobs ──────────────────────────────────────────────────────────────────────
router.get("/jobs",                  ...adminOnly, getAllJobs);
router.patch("/jobs/:id/status",     ...adminOnly, updateJobStatus);
router.delete("/jobs/:id",           ...adminOnly, deleteJob);

// ── Applications ──────────────────────────────────────────────────────────────
router.get("/applications",          ...adminOnly, getAllApplications);

module.exports = router;
