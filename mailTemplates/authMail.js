const forgotMasterPasswordTemplate = (otp) => {
  const template = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Master Password Reset</title>
</head>
<body>
    <p>Dear Admin/HR,</p>
    
    <p>Your One-Time Password (OTP) for resetting your master password is: <strong>${otp}</strong>.</p>
    
    <p>Please use it within the next 1 minute to verify your identity and complete the master password reset process.</p>
    
    <p>If you did not request this change or have any concerns, feel free to contact our support team at <a href="mailto:support@cryovault.com">support@cryovault.com</a>.</p>
    
    <p>Best regards,</p>
    <p>Cryovault</p>
</body>
</html>`;

  return template;
};

module.exports = { forgotMasterPasswordTemplate };
