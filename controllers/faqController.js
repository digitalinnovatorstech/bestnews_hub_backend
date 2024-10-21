const databases = require("../config/database/databases");
const { deleteFile } = require("../utils/deleteDocuments");
const { excelToJsonHandler } = require("../utils/excelUtils");

/*-------------------------------- create FAQ ------------------------*/
const createFAQ = async (req, res) => {
  try {
    const { question, answer, _post, _page } = req.body;

    let post = await databases.posts.findByPk(_post);
    let page = await databases.pages.findByPk(_page);
    if (!post && !page) {
      return res.status(404).json({
        success: true,
        message: "Post or Page not found",
      });
    }
    const newFAQ = await databases.faq.create({
      question,
      answer,
      _post,
      _page,
    });
    return res.status(201).json({
      success: true,
      data: newFAQ,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// const createBulkFAQ = async (req, res) => {
//   try {
//     let bulkFAQJson = await excelToJsonHandler(req);
//     //this is for delete file after fetching JSON data
//     const documentUrl = req.file.location;
//     await deleteFile(documentUrl);
//     if (!Array.isArray(bulkFAQJson)) {
//       return res.status(400).json({
//         success: false,
//         message: "Input data should be an array of customers.",
//       });
//     }
//     const createdFAQ = [];
//     const duplicateCustomers = [];
//     const outDatedEDD = [];

//     for (let i = 0; i < bulkFAQJson.length; i++) {
//       const faq = bulkFAQJson[i];
//       const newfaq = await databases.faq.create({
//         question: faq.question,
//         answer: faq.answer,
//         _post: faq._post,
//         _page: faq._page,
//       });
//     }
//   } catch (error) {
//     console.log();
//   }
// };

/*-------------------------------- get FAQ by page, post ------------------------*/
const getAllFAQs = async (req, res) => {
  try {
    const faqs = await databases.faq.findAll();
    return res.status(200).json({
      success: true,
      data: faqs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*-------------------------------- get FAQ By id ------------------------*/
const getFAQById = async (req, res) => {
  const { id } = req.params;
  try {
    const faq = await databases.faq.findByPk(id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: faq,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*-------------------------------- update FAQ ------------------------*/
const updateFAQ = async (req, res) => {
  const { id } = req.params;
  const { question, answer, _post, _page } = req.body;

  try {
    const faq = await databases.faq.findByPk(id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }
    await faq.update({ question, answer, _post, _page });
    return res.status(200).json({
      success: true,
      data: faq,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*-------------------------------- deletecomment ------------------------*/
const deleteFAQ = async (req, res) => {
  const { id } = req.params;

  try {
    const faq = await databases.faq.findByPk(id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }
    await faq.destroy();
    return res.status(204).json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createFAQ,
  getAllFAQs,
  getFAQById,
  updateFAQ,
  deleteFAQ,
};
