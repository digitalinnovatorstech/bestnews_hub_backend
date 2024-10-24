module.exports = function (sequelize, DataTypes) {
  const Categories = sequelize.define(
    "categories",
    {
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
      },
      permalink: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isDefault: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      metaTitle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      metaDescription: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      metaKeywords: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isFeatured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      icon: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      _parentCategories: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      sequelize,
      tableName: "categories",
      timestamps: true,
    }
  );

  Categories.associate = function (models) {
    Categories.belongsToMany(models.posts, {
      through: "postCategories",
      foreignKey: "categoryId",
      otherKey: "postId",
    });
  };

  return Categories;
};
