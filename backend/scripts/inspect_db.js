const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

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

  const collections = mongoose.connection.collections;
  console.log("\n--- COLLECTIONS ---");
  for (let key in collections) {
    const count = await collections[key].countDocuments();
    console.log(`${key}: ${count} documents`);
  }

  // Get a sample company and candidate
  const User = mongoose.model("User", new mongoose.Schema({ email: String, role: String }));
  const CompanyProfile = mongoose.model("CompanyProfile", new mongoose.Schema({ userId: mongoose.Schema.Types.ObjectId, companyName: String }));
  const CandidateProfile = mongoose.model("CandidateProfile", new mongoose.Schema({ userId: mongoose.Schema.Types.ObjectId, firstName: String, lastName: String }));
  const Shortlist = mongoose.model("Shortlist", new mongoose.Schema({ companyId: mongoose.Schema.Types.ObjectId, candidateId: mongoose.Schema.Types.ObjectId }));
  const Notification = mongoose.model("Notification", new mongoose.Schema({ userId: mongoose.Schema.Types.ObjectId, title: String, message: String }));

  const company = await CompanyProfile.findOne().populate("userId");
  const candidate = await CandidateProfile.findOne().populate("userId");

  console.log("\n--- SAMPLES ---");
  if (company) {
    console.log("Sample Company Profile:", {
      id: company._id,
      companyName: company.companyName,
      userId: company.userId?._id,
      userEmail: company.userId?.email
    });
  } else {
    console.log("No Company Profile found!");
  }

  if (candidate) {
    console.log("Sample Candidate Profile:", {
      id: candidate._id,
      name: `${candidate.firstName} ${candidate.lastName}`,
      userId: candidate.userId?._id,
      userEmail: candidate.userId?.email
    });
  } else {
    console.log("No Candidate Profile found!");
  }

  const shortlists = await Shortlist.find().limit(5);
  console.log(`\nShortlists (Sample ${shortlists.length}):`, shortlists);

  const notifications = await Notification.find().sort({ createdAt: -1 }).limit(5);
  console.log(`\nNotifications (Sample ${notifications.length}):`, notifications);

  await mongoose.disconnect();
};

run().catch(console.error);
