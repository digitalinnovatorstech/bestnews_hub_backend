const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const serviceAccount = require("../config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = async (req, res, next) => {
  const bearerHeader =
    req.headers["Authorization"] || req.headers["authorization"];

  if (!bearerHeader) {
    return res.status(401).json({
      success: false,
      message: "Incomplete authentication information",
    });
  }

  const accessToken = bearerHeader.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }

  try {
    const user = jwt.verify(accessToken, process.env.ACCESS_JWT_SECRET);
    if (user) {
      req.user = user;
      return next();
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please log in again.",
      });
    }
  }
  //JWT verification failed, trying Firebase token
  try {
    const decodedToken = await admin.auth().verifyIdToken(accessToken);
    console.log("Firebase Verified User:", decodedToken);
    if (decodedToken) {
      req.user = decodedToken;
      return next();
    }
  } catch (error) {
    console.log("Firebase token verification failed:", error);
  }
  return res.status(401).json({
    success: false,
    message: "Unauthorized user, please login.",
  });
};

module.exports = { auth };
