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
      raw: true,
      include: [
        {
          model: databases.posts,
          attributes: [], // Exclude post attributes as you want just the count
          through: { attributes: [] }, // Exclude the join table attributes
        },
      ],
      group: ["tags.id"], // Group by tag ID to count posts for each tag
      attributes: {
        include: [
          [
            databases.sequelize.fn(
              "COUNT",
              databases.sequelize.col("posts.id")
            ),
            "postCount",
          ],
        ],
      },
      group: ["tags.id"], // Group by tag ID
    };
    if (status) {
      whereClause.where = { status: status };
    }
    if (_categories) {
      whereClause.where = { _categories: _categories };
    }
    const tags = await databases.tags.findAll(whereClause);

    if (tags) {
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
      message: `Internal Server Error `,
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
