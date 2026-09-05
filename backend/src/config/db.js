const mongoose = require("mongoose");
const dns = require("dns");
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  console.warn("DNS override failed:", e.message);
}
mongoose.set("bufferCommands", false);
const { DB_NAME } = require("../constants");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGO_URI}`, {
      dbName: DB_NAME,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Failed: ${error.message}`);
    console.log("Proceeding with server startup (some database features may be unavailable)...");
  }
};

module.exports = connectDB;
