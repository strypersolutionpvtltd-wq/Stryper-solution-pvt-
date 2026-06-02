const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const CandidateProfile = require("../models/candidateProfile.model");
const CompanyProfile = require("../models/companyProfile.model");

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // 1. Validate required fields
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and role are required",
      });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // 3. Hash the password (salt rounds = 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create and save the user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role,
    });

    // 5. Return response — never send password back
    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.isVerified,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// @desc    Get currently authenticated user
// @route   GET /api/v1/auth/me
// @access  Private (requires token)
const getMe = async (req, res) => {
  try {
    // req.user is set by auth middleware — fetch fresh data from DB
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("GetMe Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};



// @desc    Login existing user
// @route   POST /api/v1/auth/login
// @access  Public
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // 1. Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 2. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 3. Compare password with hashed password in DB
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 4. Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // 5. Send response — never send password back
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
}

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Check if fields are provided
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    // Find logged in user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare current password
    const isPasswordMatched = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "urrent password is incorrecCt",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while changing password",
    });
  }
};

// @desc    Logout current user
// @route   POST /api/v1/auth/logout
// @access  Private (requires token)
//
// NOTE ON JWT LOGOUT STRATEGY:
// JWTs are stateless — the server does not store them, so there is nothing
// to "invalidate" on the server side. The correct professional approach is:
//   1. Backend confirms the request and returns a success response.
//   2. Frontend is responsible for deleting the token from localStorage / cookies.
// This is the industry-standard pattern for JWT-based auth without a token
// blacklist or Redis cache (which would be added in a more advanced setup).
const logoutUser = async (req, res) => {
  try {
    // The protect middleware already verified the token is valid.
    // Nothing to delete server-side — just confirm the logout.
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// @desc    Permanently delete authenticated user account and linked profile
// @route   DELETE /api/v1/auth/delete-account
// @access  Private (requires token)
const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    // 1. Password is required to confirm the destructive action
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required to delete your account",
      });
    }

    // 2. Fetch the user from DB using the ID from the verified JWT token
    //    SECURITY: Never trust a userId sent from the frontend — always use req.user.id
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 3. Verify the provided password matches the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password. Account deletion cancelled.",
      });
    }

    // 4. Delete the linked profile based on the user's role
    //    This keeps the database clean — no orphaned profile documents
    if (user.role === "CANDIDATE") {
      await CandidateProfile.findOneAndDelete({ userId: user._id });
    } else if (user.role === "COMPANY") {
      await CompanyProfile.findOneAndDelete({ userId: user._id });
    }
    // ADMIN role has no linked profile — skip profile deletion

    // 5. Delete the user account itself
    await User.findByIdAndDelete(user._id);

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete Account Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  changePassword,
  logoutUser,
  deleteAccount,
};