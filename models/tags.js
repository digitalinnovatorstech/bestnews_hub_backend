module.exports = (sequelize, DataTypes) => {
  const Tags = sequelize.define("tags", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("PUBLISHED", "DRAFT", "PENDING"),
      defaultValue: "PENDING",
      allowNull: true,
    },
    permalink: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isIndex: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: true,
    },
    metaTitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metaDescription: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    _categories: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "categories",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
  });

  Tags.associate = (models) => {
    Tags.belongsToMany(models.posts, {
      through: "postTags",
      foreignKey: "tagId",
      otherKey: "postId",
    });
  };

  return Tags;
};
