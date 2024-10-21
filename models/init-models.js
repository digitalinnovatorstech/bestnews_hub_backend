// let DataTypes = require("sequelize").DataTypes;
// let _SequelizeMeta = require("./SequelizeMeta");
// let _users = require("./users");
// let _refreshTokens = require("./refreshTokens");
// let _usersOtp = require("./usersOtp");
// let _categories = require("./categories");
// let _tags = require("./tags");
// let _posts = require("./posts");

// function initModels(sequelize) {
//   let SequelizeMeta = _SequelizeMeta(sequelize, DataTypes);
//   let users = _users(sequelize, DataTypes);
//   let refreshTokens = _refreshTokens(sequelize, DataTypes);
//   let usersOtp = _usersOtp(sequelize, DataTypes);
//   let categories = _categories(sequelize, DataTypes);
//   let tags = _tags(sequelize, DataTypes);
//   let posts = _posts(sequelize, DataTypes);

//   return {
//     SequelizeMeta,
//     users,
//     refreshTokens,
//     usersOtp,
//     categories,
//     tags,
//     posts,
//   };
// }

// module.exports = initModels;
// module.exports.initModels = initModels;
// module.exports.default = initModels;

const DataTypes = require("sequelize").DataTypes;
const _SequelizeMeta = require("./SequelizeMeta");
const _users = require("./users");
const _refreshTokens = require("./refreshTokens");
const _usersOtp = require("./usersOtp");
const _categories = require("./categories");
const _tags = require("./tags");
const _posts = require("./posts");
const _pages = require("./pages");
const _comments = require("./comments");
const _faq = require("./faq");

function initModels(sequelize) {
  const SequelizeMeta = _SequelizeMeta(sequelize, DataTypes);
  const users = _users(sequelize, DataTypes);
  const refreshTokens = _refreshTokens(sequelize, DataTypes);
  const usersOtp = _usersOtp(sequelize, DataTypes);
  const categories = _categories(sequelize, DataTypes);
  const tags = _tags(sequelize, DataTypes);
  const posts = _posts(sequelize, DataTypes);
  const pages = _pages(sequelize, DataTypes);
  const comments = _comments(sequelize, DataTypes);
  const faq = _faq(sequelize, DataTypes);

  // Call associate methods to set up relationships
  posts.associate({ tags, categories });
  tags.associate({ posts });
  categories.associate({ posts });

  return {
    SequelizeMeta,
    users,
    refreshTokens,
    usersOtp,
    categories,
    tags,
    posts,
    pages,
    comments,
    faq,
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
