module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("pages", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      header: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("PUBLISHED", "DRAFT", "PENDING"),
        defaultValue: "PENDING",
      },
      metaTitle: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      metaDescription: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      permalink: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isPublished: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isIndex: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      template: {
        type: Sequelize.ENUM(
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
        type: Sequelize.STRING,
        allowNull: true,
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      publishedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      publishedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("pages");
  },
};
