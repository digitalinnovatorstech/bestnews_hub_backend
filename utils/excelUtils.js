const fs = require("fs");
const path = require("path");
const axios = require("axios");
const excelToJson = require("convert-excel-to-json");

const downloadFile = async (url) => {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  const excelFilePath = path.join(__dirname, "excelFile.xlsx"); // Define a temporary file path
  fs.writeFileSync(excelFilePath, response.data);
  return excelFilePath;
};

const excelToJsonHandler = async (req) => {
  let excelFilePath;
  try {
    if (!req.file) {
      throw new Error("Please upload a file");
    }
    excelFilePath = await downloadFile(req.file.location);

    if (!fs.existsSync(excelFilePath)) {
      throw new Error("Faild to create Excel file.");
    }
    const result = excelToJson({
      sourceFile: excelFilePath,
      header: {
        rows: 1,
      },
      columnToKey: {
        "*": "{{columnHeader}}",
      },
    });
    if (!result || Object.keys(result).length === 0) {
      throw new Error("No sheets found in the Excel file.");
    }
    return result.Sheet1;
  } catch (error) {
    console.error("Error during Excel processing:", error);
    throw new Error(error.message);
  } finally {
    if (excelFilePath && fs.existsSync(excelFilePath)) {
      fs.unlinkSync(excelFilePath);
    }
  }
};

module.exports = {
  excelToJsonHandler,
};
