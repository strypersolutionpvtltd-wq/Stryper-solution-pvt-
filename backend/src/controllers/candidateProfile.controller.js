const CandidateProfile = require("../models/candidateProfile.model");

// @desc    Search all candidate profiles (for company resume search)
// @route   GET /api/v1/candidate/search
// @access  Private (Company / Admin)
const searchCandidates = async (req, res) => {
  try {
    const { q, location, experience, availability, skill, page = 1, limit = 20 } = req.query;

    const filter = {
      profileVisibility: { $ne: false }
    };

    if (location && location !== 'All') {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (skill) {
      filter.skills = { $regex: skill, $options: 'i' };
    }

    if (availability && availability !== 'All') {
      filter.noticePeriod = availability;
    }

    if (q) {
      filter.$or = [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName:  { $regex: q, $options: 'i' } },
        { headline:  { $regex: q, $options: 'i' } },
        { preferredJobTitle: { $regex: q, $options: 'i' } },
        { skills: { $regex: q, $options: 'i' } },
      ];
    }

    // Experience filter: totalExperience is a string like "2 years", "5+ years"
    if (experience && experience !== 'All') {
      if (experience === '0-2 years') {
        filter.$or = [
          ...(filter.$or || []),
          { totalExperience: { $in: ['0', '1', '2', '0 years', '1 year', '2 years', '1 yr', '2 yrs', '0-1 yr', '1-3 yrs'] } },
        ];
      } else if (experience === '2-5 years') {
        filter.$or = [
          ...(filter.$or || []),
          { totalExperience: { $in: ['3', '4', '5', '3 years', '4 years', '5 years', '3 yrs', '4 yrs', '5 yrs', '3-5 yrs', '1-3 yrs'] } },
        ];
      } else if (experience === '5+ years') {
        filter.$or = [
          ...(filter.$or || []),
          { totalExperience: { $in: ['6', '7', '8', '9', '10', '5-8 yrs', '8+ yrs', '6 years', '7 years', '8 years', '10+ years'] } },
        ];
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [candidates, total] = await Promise.all([
      CandidateProfile.find(filter)
        .populate('userId', 'email')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 })
        .lean(),
      CandidateProfile.countDocuments(filter),
    ]);

    const formatted = candidates.map(c => ({
      id: c._id,
      name: [c.firstName, c.lastName].filter(Boolean).join(' ') || 'Unknown Candidate',
      email: c.userId?.email || '',
      phone: c.phone || '',
      headline: c.headline || '',
      role: c.preferredJobTitle || c.headline || 'Candidate',
      location: c.location || '',
      experience: c.totalExperience || '',
      skills: c.skills || [],
      expectedSalary: c.expectedSalary || '',
      availability: c.noticePeriod || 'Immediate',
      resume: c.resume || '',
      profilePicture: c.profilePicture || '',
    }));

    return res.status(200).json({
      success: true,
      candidates: formatted,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to search candidates",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Create or Get candidate profile
// @route   POST/GET /api/v1/candidate
// @access  Private (Candidate)
const getCandidateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const profile = await CandidateProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Create candidate profile
// @route   POST /api/v1/candidate/create
// @access  Private (Candidate)
const createCandidateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { firstName, lastName, headline, bio, location, phone, skills, portfolio, linkedin, github } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "First name and last name are required",
      });
    }

    const existingProfile = await CandidateProfile.findOne({ userId });
    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: "Candidate profile already exists",
      });
    }

    const profile = await CandidateProfile.create({
      userId,
      firstName,
      lastName,
      headline: headline || "",
      bio: bio || "",
      location: location || "",
      phone: phone || "",
      skills: skills || [],
      portfolio: portfolio || "",
      linkedin: linkedin || "",
      github: github || "",
    });

    return res.status(201).json({
      success: true,
      message: "Candidate profile created",
      profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Update candidate profile
// @route   PUT /api/v1/candidate
// @access  Private (Candidate)
const updateCandidateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    const updates = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const profile = await CandidateProfile.findOneAndUpdate(
      { userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  searchCandidates,
  getCandidateProfile,
  createCandidateProfile,
  updateCandidateProfile,
};
