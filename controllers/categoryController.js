const { Op, fn, col } = require("sequelize");
const databases = require("../config/database/databases");

/*-------------- Create a new category----------*/
const createCategory = async (req, res) => {
  try {
    let inputData = req.body;

    if (inputData._parentCategories) {
      let parentCategory = await databases.categories.findOne({
        where: { id: inputData._parentCategories },
        raw: true,
      });

      if (!parentCategory) {
        return res.status(404).json({
          success: false,
          message: "Parent category not found",
        });
      }
    }

    const category = await databases.categories.create({
      name: inputData.name,
      description: inputData.description,
      status: inputData.status,
      permalink: inputData.permalink,
      isDefault: inputData.isDefault,
      slug: inputData.slug,
      metaTitle: inputData.metaTitle,
      metaDescription: inputData.metaDescription,
      metaKeywords: inputData.metaKeywords,
      isFeatured: inputData.isFeatured,
      icon: inputData.icon,
      _parentCategories: inputData._parentCategories,
    });
    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

/* --------------- Get all categories ----------*/
const getAllCategoriesList = async (req, res) => {
  let status = req.query.status;

  try {
    let whereClause = { raw: true };

    if (status) {
      whereClause.where = { status: status.toUpperCase() };
    }
    const categories = await databases.categories.findAll(whereClause);

    // const findParentCategories = async (category) => {
    //   if (!category._parentCategories) {
    //     return null;
    //   }

    //   // const parentCategory = await databases.categories.findOne({
    //   //   attributes: { exclude: ["createdAt", "updatedAt"] },
    //   //   where: { id: category._parentCategories },
    //   //   raw: true,
    //   // });

    //   // if (parentCategory) {
    //   //   parentCategory.parent = await findParentCategories(parentCategory);
    //   //   return parentCategory;
    //   // }
    //   return null;
    // };

    // const processedCategories = await Promise.all(
    //   categories.map(async (category) => {
    //     const parent = await findParentCategories(category);
    //     return {
    //       ...category,
    //       parent,
    //     };
    //   })
    // );

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

/* --------------- Get all categories for hierarchy --------------- */
const getAllCategories = async (req, res) => {
  let status = req.query.status;

  try {
    const whereClause = status
      ? {
          where: {
            status: status.toUpperCase(),
            _parentCategories: null,
          },
          raw: true,
        }
      : {
          where: {
            _parentCategories: null,
          },
          raw: true,
        };

    const categories = await databases.categories.findAll(whereClause);

    const findParentCategories = async (category) => {
      if (!category._parentCategories) {
        return null;
      }
      const parentCategory = await databases.categories.findOne({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: { id: category._parentCategories },
        raw: true,
      });

      if (parentCategory) {
        parentCategory.parent = await findParentCategories(parentCategory);
        return parentCategory;
      }

      return null;
    };

    const findChildCategories = async (categoryId) => {
      const childCategories = await databases.categories.findAll({
        where: { _parentCategories: categoryId },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        raw: true,
      });

      const processedChildren = await Promise.all(
        childCategories.map(async (child) => ({
          ...child,
          children: await findChildCategories(child.id),
        }))
      );

      return processedChildren;
    };
    const processedCategories = await Promise.all(
      categories.map(async (category) => {
        const parent = await findParentCategories(category);
        const children = await findChildCategories(category.id);
        return {
          ...category,
          parent,
          children,
        };
      })
    );
    return res.status(200).json({
      success: true,
      data: processedCategories,
    });
  } catch (error) {
    // Handle any errors and log them
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

/*--------------------Get a single category by ID-----------*/
const getCategoryById = async (req, res) => {
  try {
    let category = await databases.categories.findByPk(req.params.id, {
      raw: true,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const findParentCategories = async (category) => {
      if (!category._parentCategories) {
        return null;
      }
      const parentCategory = await databases.categories.findOne({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: { id: category._parentCategories },
        raw: true,
      });

      if (parentCategory) {
        parentCategory.parent = await findParentCategories(parentCategory);
        return parentCategory;
      }
      return null;
    };
    category.parent = await findParentCategories(category); // Get the parent category
    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

// Update a category by ID
const updateCategory = async (req, res) => {
  try {
    const category = await databases.categories.findByPk(req.params.id);
    if (category) {
      await category.update(req.body);
      res.status(200).json(category);
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a category by ID
const deleteCategory = async (req, res) => {
  try {
    const category = await databases.categories.findByPk(req.params.id);
    if (category) {
      await category.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* --------------- Get all Popular Category categories for --------------- */

const getPopularCategoriesList = async (req, res) => {
  try {
    const categories = await databases.categories.findAll({
      attributes: ["id", "name", [fn("COUNT", col("posts.id")), "postCount"]],
      include: [
        {
          model: databases.posts,
          through: {
            attributes: [],
          },
          required: false,
        },
      ],
      group: ["categories.id"],
      order: [[fn("COUNT", col("posts.id")), "DESC"]],
      // limit: 10, // Limit to top 10 categories
    });

    const result = categories.slice(0, 10).map((category) => ({
      categoryId: category.id,
      name: category.name,
      postCount: category.dataValues.postCount,
    }));

    const totalPosts = result.reduce(
      (acc, category) => acc + category.postCount,
      0
    );

    return res.status(200).json({
      success: true,
      data: { categories: result, totalPosts },
    });
  } catch (error) {
    console.error("Error fetching popular categories:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCategory,
  getAllCategoriesList,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getPopularCategoriesList,
};
