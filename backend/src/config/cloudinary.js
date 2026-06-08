const cloudinary = require("cloudinary").v2;

// Configure Cloudinary using environment variables
// NEVER hardcode credentials here — always use .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true, // always use https URLs
});

module.exports = cloudinary;
