require("dotenv").config();
const nodemailer = require("nodemailer");

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // If you're still testing, this might help
    },
    connectionTimeout: 10000,
  });
};

const sendMail = async (email, subject, message) => {
  try {
    const transporter = createTransporter();
    let info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: subject,
      html: message,
    });
    if (info.accepted.length > 0) {
      return {
        success: true,
        message: `Email sent successfully with Login Credentials to: ${email}`,
      };
    } else {
      console.log("Email sending failed:", info.rejected);
      return { success: false, message: "Failed to send email", info };
    }
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to send email", error };
  }
};
module.exports = { sendMail };
