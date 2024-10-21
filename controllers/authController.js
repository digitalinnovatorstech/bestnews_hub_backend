const databases = require("../config/database/databases");
const bcrypt = require("bcrypt");
const createTokens = require("../utils/jwt");
const moment = require("moment");
const { sendMail } = require("../utils/userMailer");
const { validatePassword } = require("../utils/validatePassword");
const { Op, where } = require("sequelize");
const { generatePassword } = require("../utils/passwordGenerate");
const { forgotMasterPasswordTemplate } = require("../mailTemplates/authMail");
const { log } = require("handlebars/runtime");

//create user
const createUser = async (req, res) => {
  try {
    let inputData = req.body;
    let isUserExist = await databases.users.findOne({
      where: { email: inputData.email },
      raw: true,
    });

    if (isUserExist) {
      return res.status(401).json({
        success: false,
        message: `Employee with this email already exists.`,
      });
    }

    let isPhoneNumberExist = await databases.users.findOne({
      where: { phoneNumber: inputData.phoneNumber },
    });

    if (isPhoneNumberExist) {
      return res.status(401).json({
        success: false,
        message: "Employee with this phone number already exists",
      });
    }
    //password valiadtion
    let validationResult = validatePassword(
      inputData.password,
      inputData.firstName,
      inputData.lastName
    );

    if (validationResult) {
      return res.status(401).json({
        success: false,
        message: validationResult,
      });
    }
    inputData.password = await bcrypt.hash(inputData.password, 10);
    if (req.file) {
      inputData.profilePhoto = req.file.location;
    }

    let userDetails = await databases.users.create({
      firstName: inputData.firstName,
      lastName: inputData.lastName,
      email: inputData.email,
      password: inputData.password,
      countryCode: inputData.countryCode,
      phoneNumber: inputData.phoneNumber,
      authorType: inputData.authorType,
      profilePhoto: inputData.profilePhoto,
      status: inputData.status,
      joiningDate: inputData.joiningDate,
      blogPostCount: inputData.blogPostCount,
      lastLogin: inputData.lastLogin,
    });

    if (userDetails) {
      let user = await databases.users.findOne({
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
        where: { id: userDetails.id },
        raw: true,
      });
      return res.status(200).json({
        success: true,
        message: "User created successfully",
        data: user,
      });
    }
    return res.status(401).json({
      success: false,
      message: "Failed to create user",
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      success: true,
      message: "Internal Server Error",
      data: error.message,
    });
  }
};

//userlogin
const loginUser = async (req, res) => {
  try {
    const { email, password, id } = req.body;

    if ((!email && !id) || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter both email and password",
      });
    }
    let user;
    if (email) {
      user = await databases.users.findOne({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: {
          email,
        },
        raw: true,
      });
    } else if (id) {
      user = await databases.users.findOne({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: { id },
        raw: true,
      });
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.status !== "ACTIVE") {
      return res.status(401).json({
        success: false,
        message: "Your account has been deactivated please contact to admin",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const payload = {
      id: user.id,
      email: user.email,
    };
    const token = await createTokens(payload);
    if (!token) {
      return res.status(404).json({
        success: false,
        message: "Failed to generate token",
      });
    }
    await databases.users.update(
      { lastLogin: new Date() },
      { where: { id: user.id } }
    );

    let userData = await databases.users.findOne({
      attributes: {
        exclude: ["createdAt", "updatedAt", "password", "masterPassword"],
      },
      where: { email: user.email },
      raw: true,
    });
    return res.status(200).json({
      success: true,
      message: "Login Success",
      data: { token, userData },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: error.message,
    });
  }
};

const forgotPasswordSendOtp = async (req, res) => {
  try {
    const { email } = req.params;
    const userData = await databases.users.findOne({
      where: { email },
      raw: true,
    });
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "The provided email address is not registered.",
      });
    }
    if (userData.status !== "Active") {
      return res.status(401).json({
        success: false,
        message:
          "Your account has been deactivated. Please contact the admin for assistance.",
      });
    }
    const checkEmailExisting = await databases.usersOtp.findOne({
      where: { email },
      raw: true,
    });
    const expireAt = moment().add(1, "minutes").format();
    var otp = Math.floor(100000 + Math.random() * 900000);

    if (!checkEmailExisting) {
      await databases.usersOtp.create({
        otp,
        email: email,
        expireAt,
      });
    } else {
      await databases.usersOtp.update(
        {
          otp,
          expireAt,
        },
        { where: { email } }
      );
    }
    const message = `Dear User,\n\nYour One-Time Password (OTP) is: ${otp}. Please use it within the next 1 minute to verify your email and complete the forget password process.\n\nIf you have any questions or concerns, feel free to contact our support team at support@cryovault.com.\n\nBest regards,\nCryovault`;

    await sendMail(email, "OTP Verification Code- Cryovault", message);

    return res.status(200).json({
      success: true,
      message: "OTP created. Please check your email.",
      data: { otp },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const forgotMasterPasswordSendOtp = async (req, res) => {
  try {
    if (req.user.roleType !== "ADMIN" && req.user.roleType !== "HR") {
      return res.status(401).json({
        success: false,
        message: "Only Admin or Hr can reset master password",
      });
    }
    const { email } = req.params;
    const userData = await databases.users.findOne({
      where: { email },
      raw: true,
    });
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "The provided email address is not registered.",
      });
    }
    if (userData.status !== "Active") {
      return res.status(401).json({
        success: false,
        message:
          "Account deactivated. Please active first to reset master password.",
      });
    }
    const checkEmailExisting = await databases.usersOtp.findOne({
      where: { email },
      raw: true,
    });
    const expireAt = moment().add(1, "minutes").format();
    var otp = Math.floor(100000 + Math.random() * 900000);

    if (!checkEmailExisting) {
      await databases.usersOtp.create({
        otp,
        email: email,
        expireAt,
      });
    } else {
      await databases.usersOtp.update(
        {
          otp,
          expireAt,
        },
        { where: { email } }
      );
    }
    const message = forgotMasterPasswordTemplate(otp);
    await sendMail(email, "OTP Verification Code- Cryovault", message);

    return res.status(200).json({
      success: true,
      message: "OTP sent. Please check your email.",
      data: { otp },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const otpVerification = async (req, res) => {
  try {
    const { otp, email } = req.body;

    const otpDetail = await databases.usersOtp.findOne({
      where: { email },
      raw: true,
    });
    if (!otpDetail) {
      return res.status(404).json({
        success: true,
        message: "OTP not found or already used.",
      });
    }

    var currentTime = new Date(moment().format());

    if (currentTime > otpDetail.expireAt) {
      return res.status(400).json({
        success: false,
        message: "Your OTP has expired.",
      });
    }

    if (otpDetail.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Wrong OTP.",
      });
    }
    await databases.usersOtp.destroy({ where: { email } });

    return res.status(200).json({
      success: true,
      message: "OTP verification successfully completed.",
    });

    // var currentTime = new Date(moment().format());
    // if (currentTime <= otpDetail.expireAt) {
    //   if (otpDetail.otp === otp) {
    //     await databases.usersOtp.destroy({
    //       where: { email },
    //     });
    //     return res.status(200).json({
    //       success: true,
    //       message: "OTP verification successfully completed.",
    //     });
    //   }
    //   return res.status(404).json({
    //     success: false,
    //     message: "Wrong OTP.",
    //   });
    // }
    // return res.status(404).json({
    //   success: false,
    //   message: "Your OTP has expired.",
    // });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      data: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { newPassword, email } = req.body;

    const user = await databases.users.findOne({ where: { email }, raw: true });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    let validationResult = validatePassword(
      newPassword,
      user.firstName,
      user.lastName
    );

    if (validationResult) {
      return res.status(401).json({
        success: false,
        message: validationResult,
      });
    }

    hashPassword = await bcrypt.hash(newPassword, 10);

    const passwordChanged = await databases.users.update(
      { password: hashPassword },
      { where: { email } }
    );
    if (passwordChanged) {
      return res.status(200).json({
        success: true,
        message: "Your password has been changed successfully.",
      });
    }
  } catch (error) {
    log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  forgotPasswordSendOtp,
  forgotMasterPasswordSendOtp,
  otpVerification,
  resetPassword,
};
