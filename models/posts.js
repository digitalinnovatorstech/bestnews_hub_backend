module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define("posts", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("PUBLISHED", "DRAFT", "PENDING"),
      defaultValue: "PENDING",
    },
    metaTitle: {
      type: DataTypes.STRING,
    },
    metaDescription: {
      type: DataTypes.STRING,
    },
    permalink: {
      type: DataTypes.STRING,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isIndex: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    layout: {
      type: DataTypes.ENUM(
        "INHERIT",
        "POST_RIGHT_SIDEBAR",
        "POST_LEFT_SIDEBAR",
        "POST_FULL_WIDTH"
      ),
      allowNull: false,
    },
    SEOImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    publishedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  });

  Posts.associate = (models) => {
    Posts.belongsToMany(models.tags, {
      through: "postTags",
      foreignKey: "postId",
      otherKey: "tagId",
    });
    Posts.belongsToMany(models.categories, {
      through: "postCategories",
      foreignKey: "postId",
      otherKey: "categoryId",
    });
  };
  return Posts;
};
