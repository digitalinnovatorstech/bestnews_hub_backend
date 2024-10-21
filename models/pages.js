module.exports = (sequelize, DataTypes) => {
  const Pages = sequelize.define(
    "pages",
    {
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
        type: DataTypes.STRING,
        allowNull: true,
      },
      header: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("PUBLISHED", "DRAFT", "PENDING"),
        defaultValue: "PENDING",
      },
      metaTitle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      metaDescription: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      permalink: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isIndex: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      template: {
        type: DataTypes.ENUM(
          "DEFAULT",
          "FULL_WIDTH",
          "HOMEPAGE",
          "PAGE_LEFT_SIDEBAR",
          "PAGE_RIGHT_SIDEBAR",
          "BLOG_GRID",
          "BLOG_LIST",
          "BLOG_BIG",
          "BLOG_WIDE"
        ),
        allowNull: false,
        defaultValue: "DEFAULT",
      },
      SEOImageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      publishedAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      publishedAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      tableName: "pages",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
      ],
    }
  );
  return Pages;
};
