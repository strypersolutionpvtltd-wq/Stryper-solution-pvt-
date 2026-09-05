require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/user.model");
const connectDB = require("./src/config/db");

const run = async () => {
  await connectDB();
  const password = process.env.ADMIN_PASSWORD || "infra@@2026";
  const email = "admin@stryper.com";
  
  const admin = await User.findOne({ email });
  if (admin) {
    const hashed = await bcrypt.hash(password, 10);
    admin.password = hashed;
    await admin.save();
    console.log(`Successfully updated admin password to: ${password}`);
  } else {
    console.log("Admin user not found. Seeding new admin.");
    const hashed = await bcrypt.hash(password, 10);
    await User.create({
      email,
      password: hashed,
      role: "ADMIN",
      fullName: "Stryper Admin",
      accountStatus: "Active",
      isVerified: true
    });
    console.log(`Created new admin with password: ${password}`);
  }
  process.exit(0);
};

run();
