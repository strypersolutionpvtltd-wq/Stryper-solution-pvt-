const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in your environment variables (.env file).");
  process.exit(1);
}

const userSchema = new mongoose.Schema({
  email: String,
  isVerified: Boolean,
  verificationOtp: String,
  verificationOtpExpires: Date
});
const User = mongoose.model('User', userSchema, 'users');

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("❌ Please provide an email address as an argument.");
    console.error("Example usage: node verify_user.js your-email@gmail.com");
    process.exit(1);
  }

  console.log(`Connecting to MongoDB...`);
  await mongoose.connect(MONGO_URI);
  console.log("Connected successfully!");

  const targetEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: targetEmail });

  if (!user) {
    console.error(`❌ User not found with email: "${targetEmail}"`);
  } else {
    user.isVerified = true;
    user.verificationOtp = null;
    user.verificationOtpExpires = null;
    await user.save();
    console.log(`\n🎉 SUCCESS! User "${targetEmail}" is now marked as VERIFIED in the database.`);
  }

  await mongoose.disconnect();
}

main().catch(console.error);
