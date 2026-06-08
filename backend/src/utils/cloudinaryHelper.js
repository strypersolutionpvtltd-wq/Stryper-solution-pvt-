const cloudinary = require("../config/cloudinary");

// ─────────────────────────────────────────────────────────────────────────────
// Delete a file from Cloudinary by its public_id
//
// Usage:
//   await deleteFromCloudinary("stryper/profiles/abc123");
//   await deleteFromCloudinary("stryper/resumes/resume_xyz", "raw");
//
// resourceType: "image" (default) | "raw" (for pdf/doc files)
// ─────────────────────────────────────────────────────────────────────────────
const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  try {
    if (!publicId) return null;

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    return result; // { result: "ok" } on success
  } catch (error) {
    // Log but don't crash the app — old file deletion is non-critical
    console.error("Cloudinary delete error:", error.message);
    return null;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Extract public_id from a Cloudinary URL
//
// Example:
//   Input : "https://res.cloudinary.com/defnbmovm/image/upload/v1234/stryper/profiles/abc123.jpg"
//   Output: "stryper/profiles/abc123"
//
// Use this before calling deleteFromCloudinary when you only have the URL.
// ─────────────────────────────────────────────────────────────────────────────
const getPublicIdFromUrl = (url) => {
  try {
    if (!url) return null;

    // Extract path after /upload/
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) return null;

    const pathAfterUpload = url.substring(uploadIndex + 8); // skip "/upload/"

    // Remove version prefix if present (e.g. "v1234567890/")
    const withoutVersion = pathAfterUpload.replace(/^v\d+\//, "");

    // Remove file extension
    const publicId = withoutVersion.replace(/\.[^/.]+$/, "");

    return publicId;
  } catch {
    return null;
  }
};

module.exports = {
  deleteFromCloudinary,
  getPublicIdFromUrl,
};
