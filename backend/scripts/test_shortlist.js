const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const Shortlist = require("../src/models/shortlist.model");
const CompanyProfile = require("../src/models/companyProfile.model");
const CandidateProfile = require("../src/models/candidateProfile.model");
const Notification = require("../src/models/notification.model");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "stryperDB",
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

const run = async () => {
  await connectDB();

  // Test values (using actual documents from DB check)
  const candidateId = "6a1e760a8d24d1f2fb2e5dc8";
  const companyUserId = "6a12a904c6b04ed6743ca9da"; // User who owns the company profile

  console.log("\n--- TEST: Add Candidate to Shortlist ---");

  // Clean up any existing shortlist for this candidate/company first
  const company = await CompanyProfile.findOne({ userId: companyUserId });
  if (!company) {
    console.error("Test Company Profile not found!");
    process.exit(1);
  }
  
  await Shortlist.deleteMany({ companyId: company._id, candidateId });
  console.log("Cleaned up existing shortlist records for test case.");

  // Retrieve candidate profile
  const candidate = await CandidateProfile.findById(candidateId);
  if (!candidate) {
    console.error("Test Candidate Profile not found!");
    process.exit(1);
  }

  // Create shortlist record
  const newShortlist = await Shortlist.create({
    companyId: company._id,
    candidateId: candidate._id,
    addedBy: companyUserId,
  });
  console.log("Successfully created Shortlist in MongoDB:", newShortlist);

  // Clean up any existing notifications for this candidate's user to make test clear
  await Notification.deleteMany({ userId: candidate.userId, title: "Profile Shortlisted" });

  // Create notification
  if (candidate.recruiterMessages !== false) {
    const notif = await Notification.create({
      userId: candidate.userId,
      title: "Profile Shortlisted",
      message: `${company.companyName} has shortlisted your profile.`,
      type: "Profile",
      relatedId: company._id,
      relatedModel: "CompanyProfile",
      actionUrl: `/career-hub/notifications`,
    });
    console.log("Successfully created Notification in MongoDB:", notif);
  } else {
    console.log("Notification skipped because recruiterMessages is false.");
  }

  console.log("\n--- TEST: Fetch Shortlist ---");
  const entries = await Shortlist.find({ companyId: company._id })
    .populate("candidateId")
    .sort({ createdAt: -1 });
  console.log(`Fetched shortlist count: ${entries.length}`);
  if (entries.length > 0) {
    console.log("First entry candidate name:", entries[0].candidateId.firstName);
  }

  await mongoose.disconnect();
  console.log("\nDisconnected from MongoDB. Test passed successfully.");
};

run().catch(console.error);
