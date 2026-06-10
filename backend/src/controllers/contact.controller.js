const nodemailer = require('nodemailer');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Send contact form message via email
// @route   POST /api/v1/contact
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const sendContactMessage = async (req, res) => {
  try {
    const { name, company, email, phone, service, message } = req.body;

    // 1. Validate required fields
    if (!name || !email || !service || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields: name, email, service, and message.',
      });
    }

    // 2. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    // 3. Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 4. Email content for admin
    const adminEmailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Company:</strong> ${company || 'Not provided'}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Service Requirement:</strong> ${service}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><small>This is an automated message from the Stryper Solutions contact form.</small></p>
    `;

    // 5. Email content for user confirmation
    const userEmailContent = `
      <h2>Thank you for contacting Stryper Solutions!</h2>
      <p>Dear ${name},</p>
      <p>We have received your message and appreciate you reaching out. Our team will review your inquiry and get back to you within 24 business hours.</p>
      <p><strong>Your submission details:</strong></p>
      <p><strong>Service Requirement:</strong> ${service}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p>Thank you for your interest in Stryper Solutions!</p>
      <p>Best regards,<br>Stryper Solutions Team</p>
    `;

    // 6. Send email to admin
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL,
      subject: `New Contact Form: ${service} - ${name}`,
      html: adminEmailContent,
      replyTo: email,
    });

    // 7. Send confirmation email to user
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'We received your message - Stryper Solutions',
      html: userEmailContent,
    });

    // 8. Send success response
    return res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!',
    });
  } catch (error) {
    console.error('Contact form error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later or contact us directly.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = {
  sendContactMessage,
};
