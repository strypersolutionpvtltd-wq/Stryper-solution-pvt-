const Interview = require("../models/interview.model");
const JobApplication = require("../models/jobApplication.model");
const Notification = require("../models/notification.model");
const CandidateProfile = require("../models/candidateProfile.model");

// @desc    Schedule interview
// @route   POST /api/v1/interviews
// @access  Private (Company)
const scheduleInterview = async (req, res) => {
  try {
    const { applicationId, interviewDate, interviewTime, interviewType, interviewLink, interviewLocation, notes, duration } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!applicationId || !interviewDate || !interviewTime || !interviewType) {
      return res.status(400).json({
        success: false,
        message: "Application ID, date, time, and type are required",
      });
    }

    const application = await JobApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const interview = await Interview.create({
      applicationId,
      jobId: application.jobId,
      candidateId: application.candidateId,
      companyId: application.companyId,
      candidateUserId: application.userId,
      interviewDate,
      interviewTime,
      interviewType,
      interviewLink: interviewLink || "",
      interviewLocation: interviewLocation || "",
      notes: notes || "",
      duration: duration || 30,
      createdBy: userId,
    });

    // Create notification for candidate
    const candidateProfileObj = await CandidateProfile.findOne({ userId: application.userId });
    if (!candidateProfileObj || candidateProfileObj.recruiterMessages !== false) {
      await Notification.create({
        userId: application.userId,
        title: "Interview Scheduled",
        message: `You have an interview scheduled for ${interviewDate}`,
        type: "Interview",
        relatedId: interview._id,
        relatedModel: "Interview",
        actionUrl: `/career-hub/interviews`,
      });
    }

    // Update application status
    await JobApplication.findByIdAndUpdate(applicationId, { status: "Shortlisted" });

    return res.status(201).json({
      success: true,
      message: "Interview scheduled successfully",
      interview,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to schedule interview",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get company interviews
// @route   GET /api/v1/interviews/company
// @access  Private (Company)
const getCompanyInterviews = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const interviews = await Interview.find({ createdBy: userId })
      .populate("candidateId", "firstName lastName headline profilePicture")
      .populate("jobId", "title")
      .populate("applicationId", "status")
      .sort({ interviewDate: 1 });

    return res.status(200).json({
      success: true,
      interviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch interviews",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get candidate interviews
// @route   GET /api/v1/interviews/candidate
// @access  Private (Candidate)
const getCandidateInterviews = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const interviews = await Interview.find({ candidateUserId: userId })
      .populate("jobId", "title description")
      .populate("companyId", "companyName companyLogo")
      .sort({ interviewDate: -1 });

    return res.status(200).json({
      success: true,
      interviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch interviews",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Update interview
// @route   PUT /api/v1/interviews/:id
// @access  Private (Company)
const updateInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, feedback, rating, notes, interviewLink } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const interview = await Interview.findById(id);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    if (interview.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this interview",
      });
    }

    const updatedInterview = await Interview.findByIdAndUpdate(
      id,
      {
        status: status || interview.status,
        feedback: feedback || interview.feedback,
        rating: rating !== undefined ? rating : interview.rating,
        notes: notes || interview.notes,
        interviewLink: interviewLink !== undefined ? interviewLink : interview.interviewLink,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Interview updated successfully",
      interview: updatedInterview,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update interview",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Cancel interview
// @route   DELETE /api/v1/interviews/:id
// @access  Private (Company)
const cancelInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const interview = await Interview.findById(id);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    if (interview.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this interview",
      });
    }

    await Interview.findByIdAndUpdate(id, { status: "Cancelled" });

    // Notify candidate
    const candidateProfileObj = await CandidateProfile.findOne({ userId: interview.candidateUserId });
    if (!candidateProfileObj || candidateProfileObj.recruiterMessages !== false) {
      await Notification.create({
        userId: interview.candidateUserId,
        title: "Interview Cancelled",
        message: "Your scheduled interview has been cancelled",
        type: "Interview",
        relatedId: interview._id,
        actionUrl: `/career-hub/interviews`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Interview cancelled successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to cancel interview",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  scheduleInterview,
  getCompanyInterviews,
  getCandidateInterviews,
  updateInterview,
  cancelInterview,
};
