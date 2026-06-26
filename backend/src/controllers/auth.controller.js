const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const User = require("../models/user.model");
const CandidateProfile = require("../models/candidateProfile.model");
const CompanyProfile = require("../models/companyProfile.model");
const SystemSettings = require("../models/systemSettings.model");

// Helper: Verify reCAPTCHA token with Google
const verifyRecaptcha = async (token) => {
  try {
    if (!token) return true; // No token = skip verification (captcha not configured on frontend)

    // If secret key not configured, skip verification
    if (!process.env.RECAPTCHA_SECRET_KEY || process.env.RECAPTCHA_SECRET_KEY === 'your_recaptcha_secret_key_here') {
      console.warn("⚠️ RECAPTCHA_SECRET_KEY not set, skipping verification");
      return true;
    }

    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token,
        },
      }
    );

    const { success, score, action } = response.data;
    console.log("reCAPTCHA result:", { success, score, action });

    // v3: success + score >= 0.3 (lenient threshold)
    // v2: just success (no score field)
    if (score !== undefined) {
      return success && score >= 0.3; // v3
    }
    return success; // v2
  } catch (error) {
    console.error("reCAPTCHA verification error:", error.message);
    return true; // On network error, allow registration (fail open)
  }
};

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { email, password, role, captchaToken } = req.body;

    // 1. Validate required fields
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and role are required",
      });
    }

    // 1.2. Check if public registration is closed
    const systemSettings = await SystemSettings.findOne({});
    if (systemSettings && systemSettings.publicRegistration === false) {
      return res.status(403).json({
        success: false,
        message: "Registration is currently closed by the administrator.",
      });
    }

    // 1.5. Verify reCAPTCHA token (if provided)
    if (captchaToken) {
      const isCaptchaValid = await verifyRecaptcha(captchaToken);
      if (!isCaptchaValid) {
        return res.status(400).json({
          success: false,
          message: "reCAPTCHA verification failed. Please try again.",
        });
      }
    } else {
      console.warn("⚠️ Registration without captcha verification (captcha not configured)");
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

    // Generate secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || "10");
    const otpExpires = new Date(Date.now() + otpExpiryMinutes * 60 * 1000);

    // 4. Create and save the user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role,
      passwordChangedAt: new Date(),
      verificationOtp: otp,
      verificationOtpExpires: otpExpires,
    });

    console.log(`\n────────────────────────────────────────────────────────────`);
    console.log(`🔑 [DEV] Registration OTP for ${email}: ${otp}`);
    console.log(`────────────────────────────────────────────────────────────\n`);

    // Send verification email in the background (non-blocking)
    const { sendVerificationOtp } = require("../services/email.service");
    sendVerificationOtp(newUser.email, otp, newUser.fullName)
      .catch((emailErr) => {
        console.error("Failed to send verification email in background:", emailErr.message);
      });

    // 5. Generate JWT token so frontend can auto-login
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // 6. Return response with token — never send password back
    return res.status(201).json({
      success: true,
      message: "Account created successfully. Please verify your email address.",
      token,
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

    if (user.accountStatus === "Suspended") {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended. Please contact admin.",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Your email is not verified. Please verify your email first.",
        isNotVerified: true,
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

    // Auto-reactivate deactivated account on login
    if (user.accountStatus === "Inactive") {
      user.accountStatus = "Active";
      await user.save();
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
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and track change time
    user.password = hashedPassword;
    user.passwordChangedAt = new Date();

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

// @desc    Verify email address using OTP
// @route   POST /api/v1/auth/verify-email
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    const isDevelopment = process.env.NODE_ENV === "development";
    const isBypassOtp = isDevelopment && otp === "123456";

    if (!isBypassOtp && (!user.verificationOtp || user.verificationOtp !== otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    if (!isBypassOtp && user.verificationOtpExpires && user.verificationOtpExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new one.",
      });
    }

    // Mark as verified
    user.isVerified = true;
    user.verificationOtp = null;
    user.verificationOtpExpires = null;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Verify Email Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// @desc    Resend email verification OTP
// @route   POST /api/v1/auth/resend-otp
// @access  Public
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || "10");
    user.verificationOtp = otp;
    user.verificationOtpExpires = new Date(Date.now() + otpExpiryMinutes * 60 * 1000);
    await user.save();

    console.log(`\n────────────────────────────────────────────────────────────`);
    console.log(`🔑 [DEV] Resent Registration OTP for ${user.email}: ${otp}`);
    console.log(`────────────────────────────────────────────────────────────\n`);

    // Send email in background (non-blocking)
    const { sendVerificationOtp } = require("../services/email.service");
    sendVerificationOtp(user.email, otp, user.fullName)
      .catch((emailErr) => {
        console.error("Failed to send verification email in background:", emailErr.message);
      });

    return res.status(200).json({
      success: true,
      message: "Verification code sent to your email",
    });
  } catch (error) {
    console.error("Resend OTP Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// @desc    Forgot Password - Request reset OTP
// @route   POST /api/v1/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    // Generate 6-digit password reset OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || "10");
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = new Date(Date.now() + otpExpiryMinutes * 60 * 1000);
    await user.save();

    console.log(`\n────────────────────────────────────────────────────────────`);
    console.log(`🔑 [DEV] Forgot Password Reset OTP for ${user.email}: ${otp}`);
    console.log(`────────────────────────────────────────────────────────────\n`);

    // Send email in background (non-blocking)
    const { sendForgotPasswordOtp } = require("../services/email.service");
    sendForgotPasswordOtp(user.email, otp, user.fullName)
      .catch((emailErr) => {
        console.error("Failed to send forgot password OTP in background:", emailErr.message);
      });

    return res.status(200).json({
      success: true,
      message: "Password reset code sent to your email",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// @desc    Verify password reset OTP
// @route   POST /api/v1/auth/verify-reset-otp
// @access  Public
const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isDevelopment = process.env.NODE_ENV === "development";
    const isBypassOtp = isDevelopment && otp === "123456";

    if (!isBypassOtp && (!user.resetPasswordOtp || user.resetPasswordOtp !== otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    if (!isBypassOtp && user.resetPasswordOtpExpires && user.resetPasswordOtpExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new one.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully. You can now reset your password.",
    });
  } catch (error) {
    console.error("Verify Reset OTP Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// @desc    Reset password using OTP
// @route   POST /api/v1/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP, and new password are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isDevelopment = process.env.NODE_ENV === "development";
    const isBypassOtp = isDevelopment && otp === "123456";

    // Verify OTP again (prevent reset bypassing)
    if (!isBypassOtp && (!user.resetPasswordOtp || user.resetPasswordOtp !== otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    if (!isBypassOtp && user.resetPasswordOtpExpires && user.resetPasswordOtpExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired",
      });
    }

    // Hash the new password (salt rounds = 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user password and clear OTP
    user.password = hashedPassword;
    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpires = null;
    user.passwordChangedAt = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

const sendSignupOtp = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and role are required",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser && existingUser.isVerified) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || "10");
    const otpExpires = new Date(Date.now() + otpExpiryMinutes * 60 * 1000);

    const hashedPassword = await bcrypt.hash(password, 10);

    const signupToken = jwt.sign(
      { 
        email: email.toLowerCase().trim(), 
        password: hashedPassword, 
        role, 
        otp, 
        otpExpires: otpExpires.getTime() 
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    console.log(`\n────────────────────────────────────────────────────────────`);
    console.log(`🔑 [DEV] Registration OTP for ${email}: ${otp}`);
    console.log(`────────────────────────────────────────────────────────────\n`);

    const { sendVerificationOtp } = require("../services/email.service");
    sendVerificationOtp(email.toLowerCase().trim(), otp, "")
      .catch((emailErr) => {
        console.error("Failed to send verification email in background:", emailErr.message);
      });

    return res.status(200).json({
      success: true,
      message: "Verification code sent to your email.",
      signupToken,
    });
  } catch (error) {
    console.error("Send Signup OTP Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

const registerVerifiedUser = async (req, res) => {
  try {
    const { signupToken, otp } = req.body;

    if (!signupToken || !otp) {
      return res.status(400).json({
        success: false,
        message: "Signup token and OTP are required",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(signupToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification session. Please signup again.",
      });
    }

    const { email, password, role, otp: expectedOtp, otpExpires } = decoded;

    const isDevelopment = process.env.NODE_ENV === "development";
    const isBypassOtp = isDevelopment && otp === "123456";

    if (!isBypassOtp && expectedOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    if (!isBypassOtp && otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new one.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(409).json({
          success: false,
          message: "An account with this email already exists",
        });
      } else {
        await User.deleteOne({ _id: existingUser._id });
      }
    }

    const newUser = await User.create({
      email,
      password,
      role,
      isVerified: true,
      passwordChangedAt: new Date(),
    });

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Account created and verified successfully.",
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.isVerified,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Register Verified User Error:", error.message);
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
  verifyEmail,
  resendOtp,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  sendSignupOtp,
  registerVerifiedUser,
};