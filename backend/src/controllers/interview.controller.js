const Interview = require("../models/interview.model");
const JobApplication = require("../models/jobApplication.model");
const CompanyProfile = require("../models/companyProfile.model");
const CandidateProfile = require("../models/candidateProfile.model");
const createNotification = require("../utils/createNotification");

// ─────────────────────────────────────────────────────────────────────────────
// HELPER — get candidate userId from an application
// Used to send notifications to the right user account
// ─────────────────────────────────────────────────────────────────────────────
const getCandidateUserIdFromApplication = async (application) => {
  const profile = await CandidateProfile.findById(application.candidateId).select("userId");
  return profile ? profile.userId : null;
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// SECURITY: IDs always resolved from req.user.id — never from request body
// ─────────────────────────────────────────────────────────────────────────────
const getCompanyProfile  = (userId) => CompanyProfile.findOne({ userId });
const getCandidateProfile = (userId) => CandidateProfile.findOne({ userId });

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Schedule a new interview
// @route   POST /api/v1/interviews
// @access  Private — COMPANY only
// ─────────────────────────────────────────────────────────────────────────────
const scheduleInterview = async (req, res) => {
  try {
    const {
      applicationId,
      scheduledBy,
      interviewTitle,
      interviewDate,
      interviewTime,
      interviewType,
      meetingPlatform,
      meetingLink,
      notes,
    } = req.body;

    // 1. Validate required fields
    if (!applicationId || !interviewTitle || !interviewDate || !interviewTime) {
      return res.status(400).json({
        success: false,
        message: "applicationId, interviewTitle, interviewDate, and interviewTime are required.",
      });
    }

    // 2. Get logged-in company profile
    //    SECURITY: companyId always comes from server
    const company = await getCompanyProfile(req.user.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found.",
      });
    }

    // 3. Verify the application exists
    const application = await JobApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Job application not found.",
      });
    }

    // 4. Ownership check — company can only schedule for their own applications
    if (application.companyId.toString() !== company._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only schedule interviews for your own job applications.",
      });
    }

    // 5. Create the interview
    const interview = await Interview.create({
      applicationId,
      companyId:   company._id,
      scheduledBy:     scheduledBy     || "",
      interviewTitle,
      interviewDate,
      interviewTime,
      interviewType:   interviewType   || "Video",
      meetingPlatform: meetingPlatform || "Google Meet",
      meetingLink:     meetingLink     || "",
      notes:           notes           || "",
      status: "Scheduled",
    });

    // 6. Notify the candidate about their scheduled interview
    const candidateUserId = await getCandidateUserIdFromApplication(application);
    if (candidateUserId) {
      await createNotification({
        userId:    candidateUserId,
        title:     "Interview Scheduled",
        message:   `An interview has been scheduled for you: "${interviewTitle}" on ${new Date(interviewDate).toDateString()} at ${interviewTime}.`,
        type:      "interview",
        relatedId: interview._id.toString(),
      });
    }

    return res.status(201).json({
      success: true,
      message: "Interview scheduled successfully.",
      interview,
    });
  } catch (error) {
    console.error("Schedule Interview Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while scheduling interview.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all interviews scheduled by the logged-in company
// @route   GET /api/v1/interviews/company/mine
// @access  Private — COMPANY only
//
// Query params:
//   page   → page number (default: 1)
//   limit  → results per page (default: 10)
//   status → filter by status (optional)
// ─────────────────────────────────────────────────────────────────────────────
const getCompanyInterviews = async (req, res) => {
  try {
    // 1. Get logged-in company profile
    const company = await getCompanyProfile(req.user.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found.",
      });
    }

    const { page = 1, limit = 10, status } = req.query;

    // 2. Build filter — always scoped to this company
    const filter = { companyId: company._id };

    if (status && ["Scheduled", "Completed", "Cancelled"].includes(status)) {
      filter.status = status;
    }

    // 3. Pagination
    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    // 4. Query with populated application + candidate + job details
    const [interviews, totalInterviews] = await Promise.all([
      Interview.find(filter)
        .populate({
          path: "applicationId",
          select: "status resumeUrl expectedSalary noticePeriod",
          populate: [
            {
              path:   "candidateId",
              select: "fullName phone location profilePicture experienceLevel skills preferredRole",
            },
            {
              path:   "jobId",
              select: "title department location employmentType",
            },
          ],
        })
        .sort({ interviewDate: 1 }) // soonest first
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Interview.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalInterviews / limitNum);

    return res.status(200).json({
      success: true,
      pagination: {
        totalInterviews,
        totalPages,
        currentPage: pageNum,
        limit:       limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      interviews,
    });
  } catch (error) {
    console.error("Get Company Interviews Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching interviews.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all interviews for the logged-in candidate
// @route   GET /api/v1/interviews/candidate/mine
// @access  Private — CANDIDATE only
//
// Strategy:
//   1. Find candidate's profile
//   2. Find all their applications
//   3. Find interviews linked to those applications
//   This ensures candidates only see their own interviews
// ─────────────────────────────────────────────────────────────────────────────
const getCandidateInterviews = async (req, res) => {
  try {
    // 1. Get logged-in candidate profile
    const candidate = await getCandidateProfile(req.user.id);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found.",
      });
    }

    const { page = 1, limit = 10, status } = req.query;

    // 2. Find all application IDs belonging to this candidate
    const applications = await JobApplication.find(
      { candidateId: candidate._id },
      "_id" // only need the IDs
    ).lean();

    const applicationIds = applications.map((a) => a._id);

    if (applicationIds.length === 0) {
      return res.status(200).json({
        success: true,
        pagination: { totalInterviews: 0, totalPages: 0, currentPage: 1, limit: parseInt(limit) },
        interviews: [],
      });
    }

    // 3. Build filter — scoped to this candidate's applications only
    const filter = { applicationId: { $in: applicationIds } };

    if (status && ["Scheduled", "Completed", "Cancelled"].includes(status)) {
      filter.status = status;
    }

    // 4. Pagination
    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    // 5. Query with populated company + job details
    const [interviews, totalInterviews] = await Promise.all([
      Interview.find(filter)
        .populate({
          path: "applicationId",
          select: "status jobId",
          populate: {
            path:   "jobId",
            select: "title department location employmentType",
          },
        })
        .populate({
          path:   "companyId",
          select: "companyName industry location companyLogo",
        })
        .sort({ interviewDate: 1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Interview.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalInterviews / limitNum);

    return res.status(200).json({
      success: true,
      pagination: {
        totalInterviews,
        totalPages,
        currentPage: pageNum,
        limit:       limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      interviews,
    });
  } catch (error) {
    console.error("Get Candidate Interviews Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching your interviews.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update interview details (date, time, link, notes, status)
// @route   PUT /api/v1/interviews/:id
// @access  Private — COMPANY only (owner only)
// ─────────────────────────────────────────────────────────────────────────────
const updateInterview = async (req, res) => {
  try {
    // 1. Get logged-in company profile
    const company = await getCompanyProfile(req.user.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found.",
      });
    }

    // 2. Find the interview
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found.",
      });
    }

    // 3. Ownership check
    if (interview.companyId.toString() !== company._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only update your own interviews.",
      });
    }

    // 4. Prevent updating a cancelled interview
    if (interview.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cannot update a cancelled interview.",
      });
    }

    // 5. Strip fields that must not be overwritten via update
    delete req.body.applicationId;
    delete req.body.companyId;

    // 6. Update
    const updated = await Interview.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    // 7. Notify the candidate that interview details have changed
    const application = await JobApplication.findById(interview.applicationId);
    if (application) {
      const candidateUserId = await getCandidateUserIdFromApplication(application);
      if (candidateUserId) {
        await createNotification({
          userId:    candidateUserId,
          title:     "Interview Updated",
          message:   `Your interview "${interview.interviewTitle}" has been updated. Please check the latest details.`,
          type:      "interview",
          relatedId: interview._id.toString(),
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Interview updated successfully.",
      interview: updated,
    });
  } catch (error) {
    console.error("Update Interview Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while updating interview.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Cancel an interview
// @route   PATCH /api/v1/interviews/:id/cancel
// @access  Private — COMPANY only (owner only)
// ─────────────────────────────────────────────────────────────────────────────
const cancelInterview = async (req, res) => {
  try {
    // 1. Get logged-in company profile
    const company = await getCompanyProfile(req.user.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found.",
      });
    }

    // 2. Find the interview
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found.",
      });
    }

    // 3. Ownership check
    if (interview.companyId.toString() !== company._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only cancel your own interviews.",
      });
    }

    // 4. Idempotency — already cancelled
    if (interview.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Interview is already cancelled.",
      });
    }

    // 5. Set status to Cancelled
    interview.status = "Cancelled";
    await interview.save();

    // 6. Notify the candidate about the cancellation
    const application = await JobApplication.findById(interview.applicationId);
    if (application) {
      const candidateUserId = await getCandidateUserIdFromApplication(application);
      if (candidateUserId) {
        await createNotification({
          userId:    candidateUserId,
          title:     "Interview Cancelled",
          message:   `Your interview "${interview.interviewTitle}" has been cancelled. Please contact the company for further details.`,
          type:      "interview",
          relatedId: interview._id.toString(),
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Interview cancelled successfully.",
      interview: {
        id:     interview._id,
        status: interview.status,
        interviewTitle: interview.interviewTitle,
      },
    });
  } catch (error) {
    console.error("Cancel Interview Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while cancelling interview.",
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
