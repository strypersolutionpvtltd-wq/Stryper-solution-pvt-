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
  getCompanyList,
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

// Company list for dropdowns
router.get("/company-list", authMiddleware, authorizeRoles("ADMIN"), getCompanyList);

module.exports = router;
