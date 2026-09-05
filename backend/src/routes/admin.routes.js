const express = require("express");
const {
  getPlatformStats,
  getAllUsers,
  getAllJobs,
  getAllApplications,
  updateUserStatus,
  verifyCompany,
  deleteUser,
  getAllPartners,
  addPartner,
  updatePartnerStatus,
  removePartner,
  deleteApplication,
  updateApplicationStatus,
  getAllInquiries,
  updateInquiryStatus,
  deleteInquiry,
  getAdminSettings,
  updateAdminSettings,
  getCompanyList,
  approveJob,
  reviewApplication,
} = require("../controllers/admin.controller");
const { protect: authMiddleware, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

// Private routes (authenticated - Admin only)
router.get("/stats", authMiddleware, authorizeRoles("ADMIN"), getPlatformStats);
router.get("/users", authMiddleware, authorizeRoles("ADMIN"), getAllUsers);
router.get("/jobs", authMiddleware, authorizeRoles("ADMIN"), getAllJobs);
router.get("/applications", authMiddleware, authorizeRoles("ADMIN"), getAllApplications);
router.patch("/users/:id/status", authMiddleware, authorizeRoles("ADMIN"), updateUserStatus);
router.patch("/companies/:id/verify", authMiddleware, authorizeRoles("ADMIN"), verifyCompany);
router.delete("/users/:id", authMiddleware, authorizeRoles("ADMIN"), deleteUser);

// Partner routes
router.get("/partners", authMiddleware, authorizeRoles("ADMIN"), getAllPartners);
router.post("/partners", authMiddleware, authorizeRoles("ADMIN"), addPartner);
router.patch("/partners/:id/status", authMiddleware, authorizeRoles("ADMIN"), updatePartnerStatus);
router.delete("/partners/:id", authMiddleware, authorizeRoles("ADMIN"), removePartner);

// Application management
router.delete("/applications/:id", authMiddleware, authorizeRoles("ADMIN"), deleteApplication);
router.patch("/applications/:id/status", authMiddleware, authorizeRoles("ADMIN"), updateApplicationStatus);

// Inquiries management
router.get("/inquiries", authMiddleware, authorizeRoles("ADMIN"), getAllInquiries);
router.patch("/inquiries/:id/status", authMiddleware, authorizeRoles("ADMIN"), updateInquiryStatus);
router.delete("/inquiries/:id", authMiddleware, authorizeRoles("ADMIN"), deleteInquiry);

// Settings management
router.get("/settings/public", getAdminSettings);
router.get("/settings", authMiddleware, authorizeRoles("ADMIN"), getAdminSettings);
router.put("/settings", authMiddleware, authorizeRoles("ADMIN"), updateAdminSettings);

// Company list for dropdowns
router.get("/company-list", authMiddleware, authorizeRoles("ADMIN"), getCompanyList);

// Job approval & application review routes
router.patch("/jobs/:id/approve", authMiddleware, authorizeRoles("ADMIN"), approveJob);
router.patch("/applications/:id/review", authMiddleware, authorizeRoles("ADMIN"), reviewApplication);

module.exports = router;
