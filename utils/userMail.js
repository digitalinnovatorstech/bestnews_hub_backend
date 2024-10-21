const nodemailer = require("nodemailer");

const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: "support@gift4day.com",
      pass: "Gift4day@123",
    },
    tls: {
      ciphers: "TLSv1.2",
    },
  });
};

const sendMail = async (email, subject, message) => {
  try {
    const transporter = createTransporter();
    let info = await transporter.sendMail({
      from: "Gift4Day <support@gift4day.com>",
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
