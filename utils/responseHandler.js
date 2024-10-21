// module.exports.success = (req, res, msg, data) => {
//   if (data) {
//     return res.json({
//       status: 200,
//       data: data,
//       message: msg,
//     });
//   } else {
//     return res.json({
//       status: 200,
//       message: msg,
//     });
//   }
// };

// module.exports.error = (req, res, msg, err) => {
//   return res.json({
//     status: 400,
//     message: msg || err.message,
//   });
// };

// module.exports.internalServerError = (req, res, msg, err) => {
//   return res.status(500).json({
//     success: false,
//     message: msg || "Internal Server Error",
//     error: err ? err.message : undefined,
//   });
// };

// module.exports.conflict = (req, res, msg, err) => {
//   return res.json({
//     status: 400,
//     message: msg || err,
//   });
// };
