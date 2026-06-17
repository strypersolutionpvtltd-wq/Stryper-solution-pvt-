const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const CandidateProfile = require("../models/candidateProfile.model");
const CompanyProfile = require("../models/companyProfile.model");
const SystemSettings = require("../models/systemSettings.model");

// @desc    Get current user settings
// @route   GET /api/v1/settings
// @access  Private
const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role === "CANDIDATE") {
      let profile = await CandidateProfile.findOne({ userId: user._id });
      if (!profile) {
        // Create candidate profile if it doesn't exist yet
        profile = await CandidateProfile.create({
          userId: user._id,
          firstName: "New",
          lastName: "Candidate",
        });
      }

      return res.status(200).json({
        success: true,
        account: {
          email: user.email,
          role: user.role,
        },
        privacy: {
          profileVisibility: profile.profileVisibility ?? true,
          resumeVisibility: profile.resumeVisibility ?? true,
          showCurrentEmployer: profile.showCurrentEmployer ?? false,
        },
        notifications: {
          jobRecommendations: profile.jobRecommendations ?? true,
          applicationUpdates: profile.applicationUpdates ?? true,
          recruiterMessages: profile.recruiterMessages ?? true,
          profileViews: profile.profileViews ?? false,
        },
      });
    }

    if (user.role === "COMPANY") {
      let profile = await CompanyProfile.findOne({ userId: user._id });
      if (!profile) {
        // Create company profile if it doesn't exist yet
        profile = await CompanyProfile.create({
          userId: user._id,
          companyName: "New Company",
          industry: "Other",
          companySize: "1-50",
          companyDescription: "Pending",
          email: user.email,
        });
      }

      return res.status(200).json({
        success: true,
        account: {
          email: user.email,
          role: user.role,
        },
        notifications: {
          newApplication: profile.newApplicationNotif ?? true,
          interviewReminder: profile.interviewReminderNotif ?? true,
          offerUpdates: profile.offerUpdatesNotif ?? true,
          weeklyReport: profile.weeklyReportNotif ?? false,
          marketingEmails: profile.marketingEmailsNotif ?? false,
        },
        privacy: {
          profileVisible: profile.profileVisible ?? true,
          showSalary: profile.showSalary ?? false,
          allowMessages: profile.allowMessages ?? true,
        },
      });
    }

    if (user.role === "ADMIN") {
      let systemSettings = await SystemSettings.findOne({});
      if (!systemSettings) {
        systemSettings = await SystemSettings.create({
          publicRegistration: true,
          maintenanceMode: false,
        });
      }

      return res.status(200).json({
        success: true,
        account: {
          email: user.email,
          role: user.role,
          fullName: user.fullName || "Super Admin",
        },
        preferences: {
          publicReg: systemSettings.publicRegistration ?? true,
          maintenance: systemSettings.maintenanceMode ?? false,
        },
      });
    }

    return res.status(400).json({ success: false, message: "Invalid user role" });
  } catch (error) {
    console.error("Get Settings Error:", error.message);
    return res.status(500).json({ success: false, message: "Server error while fetching settings" });
  }
};

// @desc    Update user settings
// @route   PUT /api/v1/settings
// @access  Private
const updateSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { email, password, privacy, notifications, preferences, profile } = req.body;

    // 1. Update general account info (Email / Password)
    if (email && email.toLowerCase() !== user.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        return res.status(400).json({ success: false, message: "Email is already in use" });
      }
      user.email = email.toLowerCase();
    }


    // 2. Update Role Specific details
    if (user.role === "CANDIDATE") {
      await user.save();

      const updateData = {};
      if (privacy) {
        if (privacy.profileVisibility !== undefined) updateData.profileVisibility = privacy.profileVisibility;
        if (privacy.resumeVisibility !== undefined) updateData.resumeVisibility = privacy.resumeVisibility;
        if (privacy.showCurrentEmployer !== undefined) updateData.showCurrentEmployer = privacy.showCurrentEmployer;
      }
      if (notifications) {
        if (notifications.jobRecommendations !== undefined) updateData.jobRecommendations = notifications.jobRecommendations;
        if (notifications.applicationUpdates !== undefined) updateData.applicationUpdates = notifications.applicationUpdates;
        if (notifications.recruiterMessages !== undefined) updateData.recruiterMessages = notifications.recruiterMessages;
        if (notifications.profileViews !== undefined) updateData.profileViews = notifications.profileViews;
      }

      const updatedProfile = await CandidateProfile.findOneAndUpdate(
        { userId: user._id },
        { $set: updateData },
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        success: true,
        message: "Settings saved successfully",
        account: {
          email: user.email,
          role: user.role,
        },
        privacy: {
          profileVisibility: updatedProfile.profileVisibility,
          resumeVisibility: updatedProfile.resumeVisibility,
          showCurrentEmployer: updatedProfile.showCurrentEmployer,
        },
        notifications: {
          jobRecommendations: updatedProfile.jobRecommendations,
          applicationUpdates: updatedProfile.applicationUpdates,
          recruiterMessages: updatedProfile.recruiterMessages,
          profileViews: updatedProfile.profileViews,
        },
      });
    }

    if (user.role === "COMPANY") {
      await user.save();

      const updateData = {};
      if (notifications) {
        if (notifications.newApplication !== undefined) updateData.newApplicationNotif = notifications.newApplication;
        if (notifications.interviewReminder !== undefined) updateData.interviewReminderNotif = notifications.interviewReminder;
        if (notifications.offerUpdates !== undefined) updateData.offerUpdatesNotif = notifications.offerUpdates;
        if (notifications.weeklyReport !== undefined) updateData.weeklyReportNotif = notifications.weeklyReport;
        if (notifications.marketingEmails !== undefined) updateData.marketingEmailsNotif = notifications.marketingEmails;
      }
      if (privacy) {
        if (privacy.profileVisible !== undefined) updateData.profileVisible = privacy.profileVisible;
        if (privacy.showSalary !== undefined) updateData.showSalary = privacy.showSalary;
        if (privacy.allowMessages !== undefined) updateData.allowMessages = privacy.allowMessages;
      }

      const updatedProfile = await CompanyProfile.findOneAndUpdate(
        { userId: user._id },
        { $set: updateData },
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        success: true,
        message: "Settings saved successfully",
        account: {
          email: user.email,
          role: user.role,
        },
        notifications: {
          newApplication: updatedProfile.newApplicationNotif,
          interviewReminder: updatedProfile.interviewReminderNotif,
          offerUpdates: updatedProfile.offerUpdatesNotif,
          weeklyReport: updatedProfile.weeklyReportNotif,
          marketingEmails: updatedProfile.marketingEmailsNotif,
        },
        privacy: {
          profileVisible: updatedProfile.profileVisible,
          showSalary: updatedProfile.showSalary,
          allowMessages: updatedProfile.allowMessages,
        },
      });
    }

    if (user.role === "ADMIN") {
      if (profile && profile.fullName !== undefined) {
        user.fullName = profile.fullName;
      }
      await user.save();

      let systemSettings = await SystemSettings.findOne({});
      if (!systemSettings) {
        systemSettings = new SystemSettings({});
      }

      if (preferences) {
        if (preferences.publicReg !== undefined) systemSettings.publicRegistration = preferences.publicReg;
        if (preferences.maintenance !== undefined) systemSettings.maintenanceMode = preferences.maintenance;
      }
      await systemSettings.save();

      return res.status(200).json({
        success: true,
        message: "Settings saved successfully",
        account: {
          email: user.email,
          role: user.role,
          fullName: user.fullName,
        },
        preferences: {
          publicReg: systemSettings.publicRegistration,
          maintenance: systemSettings.maintenanceMode,
        },
      });
    }

    return res.status(400).json({ success: false, message: "Invalid user role" });
  } catch (error) {
    console.error("Update Settings Error:", error.message);
    return res.status(500).json({ success: false, message: "Server error while saving settings" });
  }
};

// @desc    Deactivate user account
// @route   POST /api/v1/settings/deactivate
// @access  Private
const deactivateAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.accountStatus = "Inactive";
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Account deactivated successfully",
    });
  } catch (error) {
    console.error("Deactivate Account Error:", error.message);
    return res.status(500).json({ success: false, message: "Server error while deactivating account" });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  deactivateAccount,
};
