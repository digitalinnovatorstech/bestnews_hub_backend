const databases = require("../config/database/databases");

/*-------------------------------- Create Comment---------------------  */
const createComment = async (req, res) => {
  try {
    let { name, email, description, _post, _page } = req.body;

    let post = await databases.posts.findByPk(_post);
    let page = await databases.pages.findByPk(_page);
    if (!post && !page) {
      return res.status(404).json({
        success: false,
        message: "Post or page not found",
      });
    }
    const userExist = await databases.users.findOne({
      where: { email: email },
      raw: true,
    });
    let userId;
    if (userExist) {
      userId = userExist.id;
    } else if (req.user) {
      userId = req.user.id;
    }

    const newComment = await databases.comments.create({
      name: name || null,
      email: email || null,
      description: description || null,
      _post: _post || null,
      _page: _page || null,
      _user: userId || 1,
    });

    return res.status(201).json({
      success: true,
      message: "Comment created successfully",
      data: newComment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*-------------------------------- get All Comments by post, page and user ------------------------*/
const getComments = async (req, res) => {
  try {
    const { _post, _page, _user } = req.query;
    const whereClouse = {
      raw: true,
      order: [["createdAt", "DESC"]],
      where: {},
    };
    if (_post) whereClouse.where._post = _post;
    if (_page) whereClouse.where._page = _page;
    if (_user) whereClouse.where._user = _user;

    let comments = await databases.comments.findAll(whereClouse);

    return res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*-------------------------------- get Comment by comment id ------------------------*/
const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await databases.comments.findByPk(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*-------------------------------- update comment ------------------------*/
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, description, _post, _page } = req.body;

    const comment = await databases.comments.findByPk(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Update comment data
    await comment.update({
      name,
      email,
      description,
      _post,
      _page,
    });

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      data: comment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*-------------------------------- update comment ------------------------*/
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await databases.comments.findByPk(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    await comment.destroy();

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createComment,
  getComments,
  getCommentById,
  updateComment,
  deleteComment,
};
