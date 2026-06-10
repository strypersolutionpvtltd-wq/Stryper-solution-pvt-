const nodemailer = require("nodemailer");

/**
 * Controller to handle contact form submissions
 */
exports.sendContactMessage = async (req, res) => {
  try {
    const { name, company, email, phone, service, message } = req.body;

    if (!name || !email || !service || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields (Name, Email, Service, Message).",
      });
    }

    // Configure SMTP
    // You should update these in your .env file
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // your email
        pass: process.env.SMTP_PASS, // your email password or app password
      },
    });

    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || "Strypersolutionpvtltd@gmail.com",
      replyTo: email,
      subject: `New Contact Inquiry from ${name} - Stryper Solution`,
      html: `
        <h3>New Contact Inquiry</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Company:</strong> ${company || "N/A"}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Service Requested:</strong> ${service}</p>
        <br>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    // If SMTP_USER is not set, we can't send email, but we'll log it for now
    if (!process.env.SMTP_USER) {
      console.log("SMTP_USER not configured. Message received:");
      console.log(req.body);
      return res.status(200).json({
        success: true,
        message: "Message received (Development Mode: No email sent).",
      });
    }

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Your message has been sent successfully!",
    });
  } catch (error) {
    console.error("Error sending contact email:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
