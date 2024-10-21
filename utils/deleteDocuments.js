// services/s3Service.js
const { s3, DeleteObjectCommand } = require("./s3"); // Adjust path as needed
const bucketName = process.env.S3_BUCKET;
const deleteFile = async (key) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const response = await s3.send(command);
    return response;
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    throw error;
  }
};

module.exports = {
  deleteFile,
};
