const CompanyProfile = require("../models/companyProfile.model");

const createCompanyProfile = async (req, res) => {
  try {
    const existing = await CompanyProfile.findOne({ userId: req.user.id });
    if (existing) {
      return res.status(400).json({ success: false, message: "Company profile already exists" });
    }
    const profile = await CompanyProfile.create({ userId: req.user.id, ...req.body });
    return res.status(201).json({ success: true, message: "Company profile created successfully", companyProfile: profile });
  } catch (error) {
    console.error("Create Company Profile Error:", error.message);
    return res.status(500).json({ success: false, message: "Server error while creating company profile" });
  }
};

const getMyCompanyProfile = async (req, res) => {
  try {
    const profile = await CompanyProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Company profile not found" });
    }
    return res.status(200).json({ success: true, companyProfile: profile });
  } catch (error) {
    console.error("Get Company Profile Error:", error.message);
    return res.status(500).json({ success: false, message: "Server error while fetching company profile" });
  }
};

const updateCompanyProfile = async (req, res) => {
  try {
    const updated = await CompanyProfile.findOneAndUpdate(
      { userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: "Company profile not found" });
    }
    return res.status(200).json({ success: true, message: "Company profile updated successfully", companyProfile: updated });
  } catch (error) {
    console.error("Update Company Profile Error:", error.message);
    return res.status(500).json({ success: false, message: "Server error while updating company profile" });
  }
};

// @desc    Get all Stryper Partners (public — for website/partner page)
// @route   GET /api/v1/company/partners
// @access  Public
const getStryperPartners = async (req, res) => {
  try {
    const partners = await CompanyProfile.find({ isStryperPartner: true })
      .select("companyName industry companySize companyLogo location website partnerSpecialty partnerRating activeHires partnerSince isVerifiedCompany")
      .sort({ partnerRating: -1 }) // highest rated first
      .lean();

    return res.status(200).json({
      success: true,
      count: partners.length,
      partners,
    });
  } catch (error) {
    console.error("Get Stryper Partners Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching Stryper partners.",
    });
  }
};

module.exports = { createCompanyProfile, getMyCompanyProfile, updateCompanyProfile, getStryperPartners };
