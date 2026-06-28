const nodemailer = require("nodemailer");

// Reusable transporter with connection pooling and dynamic secure configurations
const smtpPort = parseInt(process.env.SMTP_PORT || "465");
const transporter = nodemailer.createTransport({
  pool: true, 
  host: process.env.SMTP_HOST || "smtpout.secureserver.net",
  port: smtpPort,
  secure: smtpPort === 465, // true only for port 465
  requireTLS: smtpPort === 587, // force STARTTLS on 587
  maxConnections: 5,
  maxMessages: 100,
  rateLimit: 5,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
    ciphers: "SSLv3", // Solve legacy TLS reset on secureserver
  },
  connectionTimeout: 20000, 
  socketTimeout: 30000,
});

// Helper: send general mail
const sendMail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: `Stryper Solution <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Branded CSS/HTML Wrapper Template
const getBrandedHtml = (title, contentHeader, contentBody, code = "") => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(139, 58, 143, 0.05);
            border: 1px solid #f1f5f9;
          }
          .header {
            background-color: #0f0f0f;
            padding: 24px;
            text-align: center;
            border-bottom: 1px solid #1e293b;
          }
          .header span {
            color: #ffffff;
            font-size: 18px;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            margin: 0;
          }
          .content {
            padding: 40px 32px;
          }
          h1 {
            color: #0f172a;
            font-size: 22px;
            font-weight: 700;
            margin-top: 0;
            margin-bottom: 16px;
            text-align: center;
          }
          p {
            color: #475569;
            font-size: 15px;
            line-height: 1.6;
            margin-top: 0;
            margin-bottom: 24px;
            text-align: center;
          }
          .otp-container {
            background-color: #f5f3ff;
            border: 2px dashed #8b3a8f;
            border-radius: 16px;
            padding: 24px;
            margin: 32px 0;
            text-align: center;
          }
          .otp-code {
            color: #8b3a8f;
            font-size: 36px;
            font-weight: 800;
            letter-spacing: 0.25em;
            margin: 0;
            font-family: monospace;
          }
          .otp-label {
            color: #64748b;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            margin-top: 8px;
          }
          .footer {
            background-color: #f8fafc;
            padding: 24px;
            text-align: center;
            border-top: 1px solid #f1f5f9;
          }
          .footer p {
            color: #94a3b8;
            font-size: 12px;
            margin: 0;
            line-height: 1.5;
          }
          .footer a {
            color: #8b3a8f;
            text-decoration: none;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span>Stryper Solution</span>
          </div>
          <div class="content">
            <h1>${contentHeader}</h1>
            <p>${contentBody}</p>
            ${
              code
                ? `
              <div class="otp-container">
                <div class="otp-code">${code}</div>
                <div class="otp-label">Verification Code</div>
              </div>
            `
                : ""
            }
            <p style="font-size: 13px; color: #94a3b8; margin-bottom: 0; text-align: center;">
              This code will expire in ${process.env.OTP_EXPIRY_MINUTES || "10"} minutes. If you did not request this, you can safely ignore this email.
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Stryper Solution. All rights reserved.</p>
            <p style="margin-top: 6px;">Need help? <a href="mailto:support@strypersolution.com">Contact Support</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
};

// Send OTP for email verification
const sendVerificationOtp = async (email, otp, name = "") => {
  const greeting = name ? `Hello ${name},` : "Hello,";
  const html = getBrandedHtml(
    "Verify Your Email",
    "Verify Your Email Address",
    `${greeting} thank you for registering with Stryper Solution. Please use the following 6-digit verification code to complete your registration:`,
    otp
  );

  return sendMail({
    to: email,
    subject: "Verify your email address - Stryper Solution",
    html,
  });
};

// Send OTP for password reset
const sendForgotPasswordOtp = async (email, otp, name = "") => {
  const greeting = name ? `Hello ${name},` : "Hello,";
  const html = getBrandedHtml(
    "Reset Your Password",
    "Password Reset Request",
    `${greeting} we received a request to reset the password for your Stryper Solution account. Please use the following 6-digit code to reset your password:`,
    otp
  );

  return sendMail({
    to: email,
    subject: "Reset your password - Stryper Solution",
    html,
  });
};

module.exports = {
  sendVerificationOtp,
  sendForgotPasswordOtp,
};
