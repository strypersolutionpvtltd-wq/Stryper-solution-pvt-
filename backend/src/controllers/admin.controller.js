const User = require("../models/user.model");
const Job = require("../models/job.model");
const JobApplication = require("../models/jobApplication.model");
const CompanyProfile = require("../models/companyProfile.model");
const CandidateProfile = require("../models/candidateProfile.model");
const SiteVisit = require("../models/siteVisit.model");
const bcrypt = require("bcryptjs");

// @desc    Get platform statistics
// @route   GET /api/v1/admin/stats
// @access  Private (Admin)
const getPlatformStats = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId);
    if (user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this",
      });
    }

    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await JobApplication.countDocuments();
    const totalCompanies = await CompanyProfile.countDocuments();
    const totalCandidates = await CandidateProfile.countDocuments();
    const totalVisits = await SiteVisit.countDocuments();

    const activeJobs = await Job.countDocuments({ status: "Active" });

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalJobs,
        totalApplications,
        totalCompanies,
        totalCandidates,
        activeJobs,
        totalVisits,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 10, role, status } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId);
    if (user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this",
      });
    }

    const filter = {};
    if (role) filter.role = role;
    if (status) filter.accountStatus = status;

    const users = await User.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const populatedUsers = await Promise.all(
      users.map(async (u) => {
        let name = "N/A";
        let profileDetails = {};
        if (u.role === "CANDIDATE") {
          const profile = await CandidateProfile.findOne({ userId: u._id });
          if (profile) {
            name = `${profile.firstName} ${profile.lastName}`;
            profileDetails = profile.toObject();
          }
        } else if (u.role === "COMPANY") {
          const profile = await CompanyProfile.findOne({ userId: u._id });
          if (profile) {
            name = profile.companyName;
            profileDetails = profile.toObject();
          }
        } else if (u.role === "ADMIN") {
          name = "Admin User";
        }
        return {
          ...u.toObject(),
          name,
          profileDetails,
        };
      })
    );

    const total = await User.countDocuments(filter);

    return res.status(200).json({
      success: true,
      users: populatedUsers,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get all jobs
// @route   GET /api/v1/admin/jobs
// @access  Private (Admin)
const getAllJobs = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 10, status } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId);
    if (user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this",
      });
    }

    const filter = {};
    if (status) filter.status = status;

    const jobs = await Job.find(filter)
      .populate("companyId", "companyName")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments(filter);

    return res.status(200).json({
      success: true,
      jobs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get all applications
// @route   GET /api/v1/admin/applications
// @access  Private (Admin)
const getAllApplications = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 10, status } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId);
    if (user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this",
      });
    }

    const filter = {};
    if (status) filter.status = status;

    const applications = await JobApplication.find(filter)
      .populate("jobId", "title")
      .populate("companyId", "companyName")
      .populate({
        path: "candidateId",
        select: "firstName lastName skills location totalExperience resume phone userId",
        populate: {
          path: "userId",
          select: "email"
        }
      })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ appliedDate: -1 });

    const total = await JobApplication.countDocuments(filter);

    return res.status(200).json({
      success: true,
      applications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Update user status
// @route   PATCH /api/v1/admin/users/:id/status
// @access  Private (Admin)
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { accountStatus } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId);
    if (user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this",
      });
    }

    if (!accountStatus || !["Active", "Suspended"].includes(accountStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'Active' or 'Suspended'",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { accountStatus },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User status updated",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update user status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Verify company profile
// @route   PATCH /api/v1/admin/companies/:id/verify
// @access  Private (Admin)
const verifyCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const adminUser = await User.findById(userId);
    if (adminUser.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this",
      });
    }

    // Try finding by userId first, then by profile _id
    let profile = await CompanyProfile.findOne({ userId: id });
    if (!profile) {
      profile = await CompanyProfile.findById(id);
    }

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    profile.isVerifiedCompany = true;
    await profile.save();

    return res.status(200).json({
      success: true,
      message: "Company verified successfully",
      profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to verify company",
      error: error.message,
    });
  }
};

// @desc    Delete user and their profile
// @route   DELETE /api/v1/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const adminUser = await User.findById(userId);
    if (adminUser.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this",
      });
    }

    const userToDelete = await User.findById(id);
    if (!userToDelete) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (userToDelete.role === "CANDIDATE") {
      await CandidateProfile.findOneAndDelete({ userId: id });
      await JobApplication.deleteMany({ candidateId: id });
    } else if (userToDelete.role === "COMPANY") {
      await CompanyProfile.findOneAndDelete({ userId: id });
      const jobs = await Job.find({ companyId: id });
      const jobIds = jobs.map(j => j._id);
      await JobApplication.deleteMany({ jobId: { $in: jobIds } });
      await Job.deleteMany({ companyId: id });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

// @desc    Get all Stryper Partners (admin)
// @route   GET /api/v1/admin/partners
// @access  Private (Admin)
const getAllPartners = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = { isStryperPartner: true };
    if (search) filter.companyName = { $regex: search, $options: "i" };

    const partners = await CompanyProfile.find(filter)
      .select("_id userId companyName industry partnerSpecialty partnerRating activeHires isVerifiedCompany partnerSince createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: partners.length,
      partners: partners.map(p => ({
        id: p._id,
        userId: p.userId,
        name: p.companyName,
        specialty: p.partnerSpecialty || p.industry || "N/A",
        experience: p.partnerSince
          ? `${new Date().getFullYear() - new Date(p.partnerSince).getFullYear()} years`
          : "N/A",
        activeHires: p.activeHires || 0,
        rating: p.partnerRating || 0,
        status: p.isVerifiedCompany ? "Verified" : "Active",
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch partners", error: error.message });
  }
};

// @desc    Add new Stryper Partner (mark existing company OR create standalone)
// @route   POST /api/v1/admin/partners
// @access  Private (Admin)
const addPartner = async (req, res) => {
  try {
    const { mode, email, password, companyName, industry, hrName, phone, website } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    let profile;

    if (mode === "link") {
      // Look up user by email
      const user = await User.findOne({ email: { $regex: `^${email}$`, $options: "i" } });
      if (!user) {
        return res.status(404).json({ success: false, message: "No account found with this email. Please select 'Register New Company' instead." });
      }

      // Find their company profile
      profile = await CompanyProfile.findOne({ userId: user._id });
      if (!profile) {
        // If user exists but no company profile, create one
        profile = await CompanyProfile.create({
          userId: user._id,
          companyName: user.fullName || "Stryper Partner",
          industry: "Recruitment",
          email: user.email,
          isStryperPartner: true,
          partnerSpecialty: "Recruitment",
          partnerRating: 5.0,
          partnerSince: new Date(),
        });
      } else {
        // Mark as partner and save
        profile.isStryperPartner = true;
        await profile.save();
      }
    } else {
      // Mode is "create" (Register New Company)
      // Check if email already exists in User model
      const existingUser = await User.findOne({ email: { $regex: `^${email}$`, $options: "i" } });
      if (existingUser) {
        return res.status(409).json({ success: false, message: "An account with this email already exists. Try using 'Link Existing Account' instead." });
      }

      if (!companyName) {
        return res.status(400).json({ success: false, message: "Company Name is required" });
      }

      const passToUse = password || `Stryper@${Math.floor(1000 + Math.random() * 9000)}`;
      const hashedPassword = await bcrypt.hash(passToUse, 10);

      const newUser = await User.create({
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: "COMPANY",
        isVerified: true,
        fullName: hrName || companyName,
      });

      profile = await CompanyProfile.create({
        userId: newUser._id,
        companyName,
        industry: industry || "General",
        companySize: "1-10",
        companyDescription: `Stryper Partner: ${companyName}`,
        email: email.toLowerCase().trim(),
        phone: phone || "",
        website: website || "",
        hrName: hrName || "",
        isStryperPartner: true,
        partnerSpecialty: industry || "General",
        partnerRating: 5.0,
        partnerSince: new Date(),
      });

      return res.status(201).json({
        success: true,
        message: "Partner account registered and added successfully",
        createdCredentials: {
          email: email.toLowerCase().trim(),
          password: passToUse,
        },
        partner: {
          id: profile._id,
          userId: profile.userId,
          name: profile.companyName,
          specialty: profile.partnerSpecialty,
          experience: "N/A",
          activeHires: profile.activeHires || 0,
          rating: profile.partnerRating,
          status: profile.isVerifiedCompany ? "Verified" : "Active",
        },
      });
    }

    return res.status(201).json({
      success: true,
      message: "Partner added successfully",
      partner: {
        id: profile._id,
        userId: profile.userId,
        name: profile.companyName,
        specialty: profile.partnerSpecialty,
        experience: "N/A",
        activeHires: profile.activeHires || 0,
        rating: profile.partnerRating,
        status: profile.isVerifiedCompany ? "Verified" : "Active",
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to add partner", error: error.message });
  }
};

// @desc    Toggle partner verified status
// @route   PATCH /api/v1/admin/partners/:id/status
// @access  Private (Admin)
const updatePartnerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await CompanyProfile.findById(id);
    if (!profile || !profile.isStryperPartner) {
      return res.status(404).json({ success: false, message: "Partner not found" });
    }
    profile.isVerifiedCompany = !profile.isVerifiedCompany;
    await profile.save();
    return res.status(200).json({
      success: true,
      message: `Partner status updated to ${profile.isVerifiedCompany ? "Verified" : "Active"}`,
      status: profile.isVerifiedCompany ? "Verified" : "Active",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update partner status", error: error.message });
  }
};

// @desc    Remove Stryper Partner (unmark, not delete)
// @route   DELETE /api/v1/admin/partners/:id
// @access  Private (Admin)
const removePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await CompanyProfile.findById(id);
    if (!profile || !profile.isStryperPartner) {
      return res.status(404).json({ success: false, message: "Partner not found" });
    }
    profile.isStryperPartner = false;
    profile.isVerifiedCompany = false;
    await profile.save();
    return res.status(200).json({ success: true, message: "Partner removed successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to remove partner", error: error.message });
  }
};

module.exports = {
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
};

// @desc    Get all companies (for admin dropdowns)
// @route   GET /api/v1/admin/company-list
// @access  Private (Admin)
async function getCompanyList(req, res) {
  try {
    const companies = await CompanyProfile.find({})
      .select("_id companyName industry")
      .sort({ companyName: 1 })
      .lean();
    return res.status(200).json({ success: true, companies });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch companies", error: error.message });
  }
}
