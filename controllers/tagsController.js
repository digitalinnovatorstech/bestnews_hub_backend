const databases = require("../config/database/databases");

/*--------------------create tag-----------*/
const createTag = async (req, res) => {
  try {
    const inputData = req.body;
    let isTagsExist = await databases.tags.findOne({
      where: { name: inputData.name?.toLowerCase() },
    });
    if (isTagsExist) {
      return res.status(400).json({
        success: false,
        message: "Tag already exists",
      });
    }
    const tags = await databases.tags.create(inputData);
    return res.status(201).json({
      success: true,
      data: tags,
      message: "Tag created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      success: false,
      message: `Internal Server Error `,
    });
  }
};

/*--------------------get all tags by status and categories-----------*/
const getAllTags = async (req, res) => {
  try {
    const { status, _categories } = req.query;
    const whereClause = {
      include: [
        {
          model: databases.posts,
          attributes: ["id"],
          through: { attributes: [] }, // Exclude the join table attributes
        },
      ],
    };

    // Add status and category filters if provided
    if (status) {
      whereClause.where = { status: status };
    }
    if (_categories) {
      whereClause.where = { _categories: _categories };
    }

    let tags = await databases.tags.findAll(whereClause);

    // Map over tags to add the total post count for each tag
    tags = tags.map((tag) => ({
      ...tag.toJSON(), // Convert Sequelize instance to plain object
      totalPost: tag.posts.length, // Add totalPost property
    }));

    if (tags.length > 0) {
      return res.status(200).json({
        success: true,
        data: tags,
      });
    }
    return res.status(404).json({
      success: false,
      message: "No tags found",
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      success: false,
      message: `Internal Server Error`,
    });
  }
};

/*--------------------Get a single Tag by ID-----------*/
const getTagById = async (req, res) => {
  try {
    const id = req.params.id;
    let tagData = await databases.tags.findOne({
      where: { id: id },
      raw: true,
    });
    if (tagData) {
      return res.status(200).json({
        success: true,
        data: tagData,
      });
    }
    return res.status(404).json({
      success: false,
      message: "Tag not found",
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      success: false,
      message: `Internal Server Error `,
    });
  }
};

/*--------------------remove a single Tag by ID-----------*/
const removeTags = async (req, res) => {
  try {
    const id = req.params.id;
    let tagData = await databases.tags.findOne({ where: { id: id } });
    if (!tagData) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }
    await databases.tags.destroy({ where: { id: id } });
    return res.status(200).json({
      success: true,
      message: "Tag removed",
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      success: false,
      message: `Internal Server Error `,
    });
  }
};

/*--------------------UpdateTag by ID-----------*/
const updateTags = async (req, res) => {
  try {
    const id = req.params.id;
    const inputData = req.body;

    let tagData = await databases.tags.findOne({
      where: { id: id },
      raw: true,
    });
    if (tagData) {
      await databases.tags.update({ inputData }, { where: { id: id } });
    }
    return res.status(200).json({
      success: true,
      message: "Tag updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      success: false,
      message: `Internal Server Error `,
    });
  }
};

module.exports = { createTag, getAllTags, getTagById, removeTags, updateTags };
