const databases = require("../config/database/databases");
const { excelToJsonHandler } = require("../utils/excelUtils");

/*-------------------------- Create Page -----------------------------*/
const createPage = async (req, res) => {
  try {
    const {
      title,
      content,
      description,
      header,
      status,
      metaTitle,
      metaDescription,
      permalink,
      isPublished,
      isIndex,
      template,
      SEOImageUrl,
      imageUrl,
      publishedAt,
      faq,
    } = req.body;

    const createdPage = await databases.pages.create({
      title,
      content,
      description,
      header,
      status,
      metaTitle,
      metaDescription,
      permalink,
      isPublished,
      isIndex,
      template,
      SEOImageUrl,
      imageUrl,
      publishedAt,
    });

    let newPage = await databases.pages.findOne({
      where: { id: createdPage.id },
      raw: true,
    });

    let bulkFAQJson;
    //check excel file return json and bulk insert

    if (req.file) bulkFAQJson = await excelToJsonHandler(req);
    if (faq && faq.length > 0) bulkFAQJson = bulkFAQJson.concat(faq);

    let faqs = [];
    for (let i = 0; i < bulkFAQJson.length; i++) {
      let faq = bulkFAQJson[i];
      let addedFAQ = await databases.faq.create({
        question: faq.question,
        answer: faq.answer,
        _page: newPage.id,
      });
      faqs.push(addedFAQ);
    }
    newPage.faqs = faqs;
    return res.status(201).json({
      success: true,
      message: "Page created successfully",
      data: newPage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*-------------------------- get All Pages -----------------------------*/
const getPages = async (req, res) => {
  try {
    const { status, isPublished } = req.query;
    const whereClouse = {
      attributes: { exclude: ["updatedAt"] },
      order: [["publishedAt", "DESC"]],
      // order: [["createdAt", "DESC"]],

      where: {},
      raw: true,
    };
    if (status) whereClouse.where.status = status?.toUpperCase();
    if (isPublished) whereClouse.where.isPublished = isPublished;

    const pages = await databases.pages.findAll(whereClouse);
    if (pages) {
      for (let i = 0; i < pages.length; i++) {
        let page = pages[i];
        page.totalcomments = await databases.comments.count({
          where: { _post: page.id },
        });
        page.comments = await databases.comments.findAll({
          attributes: { exclude: ["updatedAt"] },
          order: [["createdAt", "DESC"]],
          where: { _post: page.id },
          raw: true,
        });
        page.faq = await databases.faq.findAll({
          attributes: { exclude: ["updatedAt"] },
          order: [["createdAt", "DESC"]],
          where: { _page: page.id },
          raw: true,
        });
      }

      return res.status(200).json({
        success: true,
        data: pages,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*-------------------------- get Page by Id -----------------------------*/
const getPageById = async (req, res) => {
  try {
    const { id } = req.params;
    const page = await databases.pages.findByPk(id, { raw: true });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }
    page.totalcomments = await databases.comments.count({
      where: { _post: page.id },
    });
    page.comments = await databases.comments.findAll({
      where: { _post: page.id },
    });
    page.faq = await databases.faq.findAll({
      attributes: { exclude: ["updatedAt"] },
      order: [["createdAt", "DESC"]],
      where: { _page: page.id },
      raw: true,
    });
    return res.status(200).json({
      success: true,
      data: page,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*-------------------------- Update Page -----------------------------*/
const updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      description,
      header,
      status,
      metaTitle,
      metaDescription,
      permalink,
      isPublished,
      isIndex,
      template,
      SEOImageUrl,
      imageUrl,
      publishedAt,
    } = req.body;

    const page = await databases.pages.findByPk(id);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }
    await page.update({
      title,
      content,
      description,
      header,
      status,
      metaTitle,
      metaDescription,
      permalink,
      isPublished,
      isIndex,
      template,
      SEOImageUrl,
      imageUrl,
      publishedAt,
    });

    return res.status(200).json({
      success: true,
      message: "Page updated successfully",
      data: page,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*-------------------------- delete Page -----------------------------*/
const deletePage = async (req, res) => {
  try {
    const { id } = req.params;
    const page = await databases.pages.findByPk(id);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }
    await page.destroy();

    return res.status(200).json({
      success: true,
      message: "Page deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { createPage, getPages, getPageById, updatePage, deletePage };
