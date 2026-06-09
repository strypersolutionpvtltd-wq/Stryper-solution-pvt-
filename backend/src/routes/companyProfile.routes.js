const express = require("express");
const { createCompanyProfile, getMyCompanyProfile, updateCompanyProfile, getStryperPartners } = require("../controllers/companyProfile.controller");
const { protect, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

// GET /api/v1/company/partners — public list of all Stryper partners (no auth needed)
router.get("/partners", getStryperPartners);

router.post("/create", protect, authorizeRoles("COMPANY"), createCompanyProfile);
router.get("/me", protect, authorizeRoles("COMPANY"), getMyCompanyProfile);
router.put("/update", protect, authorizeRoles("COMPANY"), updateCompanyProfile);

module.exports = router;
