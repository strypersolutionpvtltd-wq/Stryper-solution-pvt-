const nodemailer = require("nodemailer");
require("dotenv").config();

const user = process.env.SMTP_USER || "rishabh.saini@strypersolution.com";
const pass = process.env.SMTP_PASS || "StryperSolution@098";

const configs = [
  { host: "smtpout.secureserver.net", port: 465, secure: true, name: "GoDaddy smtpout Port 465 SSL/TLS" },
  { host: "smtpout.secureserver.net", port: 587, secure: false, name: "GoDaddy smtpout Port 587 STARTTLS" },
  { host: "smtp.secureserver.net", port: 465, secure: true, name: "GoDaddy smtp Port 465 SSL/TLS" },
  { host: "smtp.secureserver.net", port: 587, secure: false, name: "GoDaddy smtp Port 587 STARTTLS" }
];

const testSmtp = async (config) => {
  console.log(`Testing: ${config.name} (${config.host}:${config.port})`);
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });

  return new Promise((resolve) => {
    transporter.verify((error, success) => {
      if (error) {
        console.error(`❌ FAILED for ${config.name}:`, error.message);
        resolve(false);
      } else {
        console.log(`\n🎉 SUCCESS! Config: ${config.name} works!`);
        resolve(true);
      }
    });
  });
};

const run = async () => {
  for (const config of configs) {
    const ok = await testSmtp(config);
    if (ok) {
      console.log(`Working configuration found! Host: ${config.host}, Port: ${config.port}, Secure: ${config.secure}`);
      break;
    }
  }
  process.exit();
};

run();
