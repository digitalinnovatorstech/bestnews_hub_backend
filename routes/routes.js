const express = require("express");
const { createUser, loginUser } = require("../controllers/authController");
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getAllCategoriesList,
  getPopularCategoriesList,
} = require("../controllers/categoryController");
const {
  createTag,
  getAllTags,
  getTagById,
  removeTags,
  updateTags,
} = require("../controllers/tagsController");
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/postsController");
const {
  createPage,
  getPages,
  getPageById,
  updatePage,
  deletePage,
} = require("../controllers/pagesController");
const {
  createComment,
  getComments,
  getCommentById,
  updateComment,
  deleteComment,
} = require("../controllers/commentsController");
const upload = require("../middlewares/upload");
const { auth } = require("../middlewares/auth");
const router = express.Router();

/*====================================================================================================
  =====================================  User Routes  ============================================ 
====================================================================================================*/
router.post("/admin/create/user", createUser);
router.post("/admin/login/user", loginUser);

/*====================================================================================================
  ======================================  Category Routes  =========================================
====================================================================================================*/
router.post("/admin/category/create", createCategory);
router.get("/admin/category/getAll", getAllCategories);
router.get("/admin/allCategory/list", getAllCategoriesList);
router.get("/admin/category/popular", getPopularCategoriesList);
router.get("/admin/category/getById/:id", getCategoryById);
router.put("/admin/category/update/:id", updateCategory);
router.delete("/admin/category/delete/:id", deleteCategory);

/*====================================================================================================
  =====================================  Tags Routes  ============================================ 
====================================================================================================*/
router.post("/admin/tags/create", createTag);
router.get("/admin/tags/getAll", getAllTags);
router.get("/admin/tags/getById/:id", getTagById);
router.put("/admin/tags/update/:id", updateTags);
router.delete("/admin/tags/delete/:id", removeTags);

/*====================================================================================================
  =====================================  Posts Routes  ============================================ 
====================================================================================================*/
router.post("/admin/posts/create", upload.single("faqFile"), createPost);
router.get("/admin/posts/getAll", getPosts);
router.get("/admin/posts/getById/:id", getPostById);
router.put("/admin/posts/update/:id", updatePost);
router.delete("/admin/posts/delete/:id", deletePost);

/*====================================================================================================
  =====================================  Pages Routes  ============================================ 
====================================================================================================*/
router.post("/admin/pages/create", upload.single("faqFile"), createPage);
router.get("/admin/pages/getAll", getPages);
router.get("/admin/pages/getById/:id", getPageById);
router.put("/admin/pages/update/:id", updatePage);
router.delete("/admin/pages/delete/:id", deletePage);

/*====================================================================================================
  =====================================  Pages Routes  ============================================ 
====================================================================================================*/
router.post("/admin/comments/create", createComment);
router.get("/admin/comments/getAll", getComments);
router.get("/admin/comments/getById/:id", getCommentById);
router.put("/admin/comments/update/:id", updateComment);
router.delete("/admin/comments/delete/:id", deleteComment);

module.exports = router;
