const { Op } = require("sequelize");
const databases = require("../config/database/databases");
const moment = require("moment");
const { excelToJsonHandler } = require("../utils/excelUtils");

/*-------------------------- Create Post -----------------------------*/

const createPost = async (req, res) => {
  try {
    const {
      title,
      content,
      status,
      metaTitle,
      metaDescription,
      permalink,
      isPublished,
      isIndex,
      layout,
      SEOImageUrl,
      tagIds,
      categoryIds,
      faq,
    } = req.body;

    // Create the post
    const createdPost = await databases.posts.create({
      title,
      content,
      status,
      metaTitle,
      metaDescription,
      permalink,
      isPublished,
      isIndex,
      layout,
      SEOImageUrl,
    });

    if (tagIds && tagIds.length > 0) {
      const tags = await databases.tags.findAll({ where: { id: tagIds } });
      await createdPost.addTags(tags);
    }

    if (categoryIds && categoryIds.length > 0) {
      const categories = await databases.categories.findAll({
        where: { id: categoryIds },
      });
      await createdPost.addCategories(categories);
    }
    let newPost = await databases.posts.findOne({
      where: { id: createdPost.id },
      raw: true,
    });
    let bulkFAQJson;
    //check excel file return json and bulk insert

    if (req.file) bulkFAQJson = await excelToJsonHandler(req);
    if (faq && faq.length > 0) bulkFAQJson = bulkFAQJson.concat(faq);

    let faqs = [];
    if (bulkFAQJson) {
      for (let i = 0; i < bulkFAQJson.length; i++) {
        let faq = bulkFAQJson[i];
        let addedFAQ = await databases.faq.create({
          question: faq.question,
          answer: faq.answer,
          _post: newPost.id,
        });
        faqs.push(addedFAQ);
      }
    }
    newPost.faqs = faqs;
    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: newPost,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*-------------------------- get All Posts -----------------------------*/
const getPosts = async (req, res) => {
  try {
    const { tag, tagIds, category, categoryIds, status, thisMonth } = req.query;

    const queryOptions = {
      include: [
        { model: databases.tags, through: { attributes: [] } },
        { model: databases.categories, through: { attributes: [] } },
      ],
      order: [["createdAt", "DESC"]],
      where: {},
      // raw: true,
    };

    if (tagIds) {
      const tagsArray = Array.isArray(tagIds) ? tagIds : [tagIds];
      queryOptions.include[0].where = {
        id: tagsArray,
      };
    }
    if (tag) {
      let tagRecord = await databases.tags.findOne({
        where: { name: { [Op.like]: tag } },
      });
      if (tagRecord) {
        const tagId = tagRecord.id;
        queryOptions.include[0].where = {
          id: tagId,
        };
      }
    }
    if (categoryIds) {
      const categoriesArray = Array.isArray(categoryIds)
        ? categoryIds
        : [categoryIds];
      queryOptions.include[1].where = {
        id: categoriesArray,
      };
    }
    if (category) {
      let categoryRecord = await databases.categories.findOne({
        where: { name: { [Op.like]: `%${category}%` } },
      });

      if (categoryRecord) {
        const categoryId = categoryRecord.id;
        // Ensure the filter is applied to the correct include for categories
        if (!queryOptions.include[1]) {
          queryOptions.include[1] = {};
        }
        queryOptions.include[1].where = { id: categoryId }; // Apply filter to categories
      }
    }

    if (status) {
      queryOptions.where.status = status.toUpperCase();
    }

    if (thisMonth) {
      const startOfMonth = moment().startOf("month").toDate();
      const endOfMonth = moment().endOf("month").toDate();

      queryOptions.where.createdAt = {
        [Op.between]: [startOfMonth, endOfMonth],
      };
    }
    console.log(queryOptions);

    const posts = await databases.posts.findAll(queryOptions);
    if (posts) {
      for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        post.totalcomments = await databases.comments.count({
          where: { _post: post.id },
        });
        post.comments = await databases.comments.findAll({
          attributes: { exclude: ["updatedAt"] },
          order: [["createdAt", "DESC"]],
          where: { _post: post.id },
        });
        post.faq = await databases.faq.findAll({
          attributes: { exclude: ["updatedAt"] },
          order: [["createdAt", "DESC"]],
          where: { _post: post.id },
          raw: true,
        });
      }
      return res.status(200).json({
        success: true,
        data: posts,
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

/*-------------------------- get Post By Id -----------------------------*/
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await databases.posts.findByPk(id, {
      include: [databases.tags, databases.categories],
      raw: true,
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    post.totalcomments = await databases.comments.count({
      where: { _post: post.id },
    });
    post.comments = await databases.comments.findAll({
      attributes: { exclude: ["updatedAt"] },
      order: [["createdAt", "DESC"]],
      where: { _post: post.id },
    });
    post.faq = await databases.faq.findAll({
      attributes: { exclude: ["updatedAt"] },
      order: [["createdAt", "DESC"]],
      where: { _post: post.id },
      raw: true,
    });
    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*-------------------------- Update Post by ID -----------------------------*/
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      status,
      metaTitle,
      metaDescription,
      permalink,
      isPublished,
      isIndex,
      layout,
      SEOImageUrl,
      tagIds,
      categoryIds,
    } = req.body;

    let post = await databases.posts.findByPk(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Update post fields
    await post.update({
      title,
      content,
      status,
      metaTitle,
      metaDescription,
      permalink,
      isPublished,
      isIndex,
      layout,
      SEOImageUrl,
    });

    if (tagIds && tagIds.length > 0) {
      const tags = await databases.tags.findAll({ where: { id: tagIds } });
      await post.setTags(tags);
    }

    if (categoryIds && categoryIds.length > 0) {
      const categories = await databases.categories.findAll({
        where: { id: categoryIds },
      });
      await post.setCategories(categories);
    }

    post = await databases.posts.findByPk(id, {
      include: [databases.tags, databases.categories],
      // raw: true,
    });

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*--------------------------UpdateTag by ID-----------------------------*/
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await databases.posts.findByPk(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    await post.destroy();
    res.status(200).json({
      success: true,
      data: post,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { createPost, getPosts, getPostById, updatePost, deletePost };
