const Shortlist      = require("../models/shortlist.model");
const CompanyProfile = require("../models/companyProfile.model");
const CandidateProfile = require("../models/candidateProfile.model");

// Helper: get company profile for current user
const getCompany = async (userId) => CompanyProfile.findOne({ userId });

// @desc  Add candidate to shortlist
// @route POST /api/v1/shortlist/:candidateId
// @access Private (Company)
const addToShortlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { candidateId } = req.params;

    const company = await getCompany(userId);
    if (!company) return res.status(404).json({ success: false, message: "Company profile not found" });

    const candidate = await CandidateProfile.findById(candidateId);
    if (!candidate) return res.status(404).json({ success: false, message: "Candidate not found" });

    await Shortlist.create({ companyId: company._id, candidateId, addedBy: userId });

    return res.status(201).json({ success: true, message: "Candidate shortlisted" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Already shortlisted" });
    }
    return res.status(500).json({ success: false, message: "Failed to shortlist", error: process.env.NODE_ENV === "development" ? error.message : undefined });
  }
};

// @desc  Remove candidate from shortlist
// @route DELETE /api/v1/shortlist/:candidateId
// @access Private (Company)
const removeFromShortlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { candidateId } = req.params;

    const company = await getCompany(userId);
    if (!company) return res.status(404).json({ success: false, message: "Company profile not found" });

    await Shortlist.deleteOne({ companyId: company._id, candidateId });

    return res.status(200).json({ success: true, message: "Removed from shortlist" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to remove", error: process.env.NODE_ENV === "development" ? error.message : undefined });
  }
};

// @desc  Get all shortlisted candidates for this company
// @route GET /api/v1/shortlist
// @access Private (Company)
const getShortlist = async (req, res) => {
  try {
    const userId = req.user?.id;

    const company = await getCompany(userId);
    if (!company) return res.status(404).json({ success: false, message: "Company profile not found" });

    const entries = await Shortlist.find({ companyId: company._id })
      .populate("candidateId", "firstName lastName headline location skills resume profilePicture totalExperience expectedSalary noticePeriod preferredJobTitle")
      .populate({ path: "candidateId", populate: { path: "userId", select: "email" } })
      .sort({ createdAt: -1 });

    const candidates = entries
      .filter(e => e.candidateId)
      .map(e => {
        const c = e.candidateId;
        return {
          id:             c._id,
          name:           [c.firstName, c.lastName].filter(Boolean).join(" ") || "Unknown Candidate",
          email:          c.userId?.email || "",
          phone:          c.phone || "",
          role:           c.preferredJobTitle || c.headline || "Candidate",
          location:       c.location || "",
          experience:     c.totalExperience || "",
          skills:         c.skills || [],
          expectedSalary: c.expectedSalary || "",
          availability:   c.noticePeriod || "Immediate",
          resume:         c.resume || "",
          profilePicture: c.profilePicture || "",
        };
      });

    return res.status(200).json({ success: true, candidates });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch shortlist", error: process.env.NODE_ENV === "development" ? error.message : undefined });
  }
};

module.exports = { addToShortlist, removeFromShortlist, getShortlist };
