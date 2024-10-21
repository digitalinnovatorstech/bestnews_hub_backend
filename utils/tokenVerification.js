// // Import the Firebase Admin SDK
// const admin = require("firebase-admin");

// // Path to your service account key JSON file
// const serviceAccount = require("../config/serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// const verifyToken = async (token) => {
//   try {
//     const decodedToken = await admin.auth().verifyIdToken(token);
//     return decodedToken;
//   } catch (error) {
//     console.error("Error verifying token:", error.message);
//     throw new Error("Unauthorized: Invalid or expired token");
//   }
// };

// const fireBaseTokenVerify = async (req, res) => {
//   try {
//     const { idToken } = req.body;
//     const user = await verifyToken(idToken);
//     console.log("User UID:", user.uid);
//     return res.status(200).json({
//       success: true,
//       data: user,
//     });
//   } catch (error) {
//     console.log("Authentication failed:", error.message);
//     return res.status(500).json({
//       success: false,
//       data: error.message,
//     });
//   }
// };

// module.exports = { fireBaseTokenVerify };
