const JobApplication = require("../models/jobApplication.model");
const Job = require("../models/job.model");
const CandidateProfile = require("../models/candidateProfile.model");
const CompanyProfile = require("../models/companyProfile.model");
const Notification = require("../models/notification.model");

// @desc    Get all applicants for a company (across all jobs)
// @route   GET /api/v1/applications/company
// @access  Private (Company)
const getCompanyApplicants = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const companyProfile = await CompanyProfile.findOne({ userId });
    if (!companyProfile) {
      return res.status(404).json({ success: false, message: "Company profile not found" });
    }

    const applications = await JobApplication.find({ companyId: companyProfile._id })
      .populate("candidateId", "firstName lastName headline location skills resume phone totalExperience expectedSalary noticePeriod profilePicture")
      .populate("userId", "email")
      .populate("jobId", "title")
      .sort({ appliedDate: -1 });

    const formatted = applications.map(app => ({
      id: app._id,
      applicationId: app._id,
      name: app.candidateId
        ? `${app.candidateId.firstName} ${app.candidateId.lastName}`.trim()
        : 'Unknown Candidate',
      email: app.userId?.email || '',
      phone: app.candidateId?.phone || '',
      location: app.candidateId?.location || '',
      appliedRole: app.jobId?.title || 'Unknown Role',
      jobId: app.jobId?._id || null,
      skills: app.candidateId?.skills || [],
      experience: app.candidateId?.totalExperience || '',
      expectedSalary: app.candidateId?.expectedSalary || (app.salaryExpectation ? `₹${app.salaryExpectation}` : ''),
      noticePeriod: app.candidateId?.noticePeriod || app.noticePeriod || '',
      resume: app.candidateId?.resume || app.resume || '',
      profilePicture: app.candidateId?.profilePicture || '',
      stage: app.status,
      appliedDate: new Date(app.appliedDate).toISOString().split('T')[0],
      coverLetter: app.coverLetter || '',
      notes: app.notes || '',
      rating: app.rating || 0,
    }));

    return res.status(200).json({ success: true, applications: formatted });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applicants",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Apply for a job
// @route   POST /api/v1/applications
// @access  Private (Candidate)
const applyForJob = async (req, res) => {
  try {
    const { jobId, resume, coverLetter, salaryExpectation, noticePeriod } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!jobId || !resume) {
      return res.status(400).json({
        success: false,
        message: "Job ID and resume are required",
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    let candidateProfile = await CandidateProfile.findOne({ userId });
    if (!candidateProfile) {
      const User = require("../models/user.model");
      const user = await User.findById(userId).select("email");
      const namePart = (user?.email || 'candidate').split('@')[0];
      const parts = namePart.split('.');
      candidateProfile = await CandidateProfile.create({
        userId,
        firstName: parts[0] || 'Candidate',
        lastName:  parts[1] || '',
      });
    }

    // Check if already applied
    const existingApplication = await JobApplication.findOne({
      jobId,
      candidateId: candidateProfile._id,
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    const application = await JobApplication.create({
      jobId,
      candidateId: candidateProfile._id,
      companyId: job.companyId,
      userId,
      resume,
      coverLetter: coverLetter || "",
      salaryExpectation: salaryExpectation || null,
      noticePeriod: noticePeriod || "",
      isStryperApplication: job.isStryper || false,
    });

    // Update job application count
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } });

    // Create notification for company
    const company = await CompanyProfile.findById(job.companyId);
    if (company && company.newApplicationNotif !== false) {
      await Notification.create({
        userId: company.userId,
        title: "New Application",
        message: `${candidateProfile.firstName} ${candidateProfile.lastName} applied for ${job.title}`,
        type: "Application",
        relatedId: application._id,
        relatedModel: "JobApplication",
        actionUrl: `/hire-zone/applicants`,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to submit application",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get my applications (candidate)
// @route   GET /api/v1/applications/me
// @access  Private (Candidate)
const getMyApplications = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const candidateProfile = await CandidateProfile.findOne({ userId });
    if (!candidateProfile) {
      // No profile = no applications yet, return empty array
      return res.status(200).json({ success: true, applications: [] });
    }

    const applications = await JobApplication.find({ candidateId: candidateProfile._id })
      .populate("jobId", "title description salary location")
      .populate("companyId", "companyName companyLogo")
      .sort({ appliedDate: -1 });

    return res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get applicants for a job (company)
// @route   GET /api/v1/applications/job/:jobId
// @access  Private (Company)
const getJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const companyProfile = await CompanyProfile.findOne({ userId });
    if (!companyProfile || job.companyId.toString() !== companyProfile._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view applicants",
      });
    }

    const applications = await JobApplication.find({ jobId })
      .populate("candidateId", "firstName lastName headline location skills resume phone totalExperience expectedSalary noticePeriod")
      .populate("userId", "email")
      .sort({ appliedDate: -1 });

    return res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applicants",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Update application status
// @route   PATCH /api/v1/applications/:id/status
// @access  Private (Company)
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, rating } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const application = await JobApplication.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const companyProfile = await CompanyProfile.findOne({ userId });
    if (!companyProfile || application.companyId.toString() !== companyProfile._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this application",
      });
    }

    const updatedApplication = await JobApplication.findByIdAndUpdate(
      id,
      {
        status,
        notes: notes || application.notes,
        rating: rating !== undefined ? rating : application.rating,
      },
      { new: true }
    );

    // Create notification for candidate
    const statusMessages = {
      Reviewed: "Your application has been reviewed",
      Shortlisted: "Congratulations! You have been shortlisted",
      Rejected: "Thank you for your interest. We have decided to move forward with other candidates",
      Accepted: "Congratulations! Your application has been accepted",
    };

    if (statusMessages[status]) {
      const candidateProfileObj = await CandidateProfile.findOne({ userId: application.userId });
      if (!candidateProfileObj || candidateProfileObj.applicationUpdates !== false) {
        await Notification.create({
          userId: application.userId,
          title: `Application ${status}`,
          message: statusMessages[status],
          type: "Application",
          relatedId: application.jobId,
          relatedModel: "Job",
          actionUrl: `/career-hub/applied-jobs`,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Application status updated",
      application: updatedApplication,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update application status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Withdraw application
// @route   DELETE /api/v1/applications/:id
// @access  Private (Candidate)
const withdrawApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const application = await JobApplication.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (application.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to withdraw this application",
      });
    }

    await JobApplication.findByIdAndDelete(id);

    // Decrement job application count
    await Job.findByIdAndUpdate(application.jobId, { $inc: { applicationCount: -1 } });

    return res.status(200).json({
      success: true,
      message: "Application withdrawn successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to withdraw application",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  getCompanyApplicants,
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  withdrawApplication,
};
