module.exports = {
  async up(queryInterface, Sequelize) {
    // Create posts table
    await queryInterface.createTable("posts", {
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
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("PUBLISHED", "DRAFT", "PENDING"),
        defaultValue: "PENDING",
      },
      metaTitle: {
        type: Sequelize.STRING,
      },
      metaDescription: {
        type: Sequelize.STRING,
      },
      permalink: {
        type: Sequelize.STRING,
      },
      isPublished: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isIndex: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      layout: {
        type: Sequelize.ENUM(
          "INHERIT",
          "POST_RIGHT_SIDEBAR",
          "POST_LEFT_SIDEBAR",
          "POST_FULL_WIDTH"
        ),
        allowNull: false,
      },
      SEOImageUrl: {
        type: Sequelize.TEXT,
        allowNull: true,
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

    // Create postTags junction table
    await queryInterface.createTable("postTags", {
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "posts",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      tagId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "tags",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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

    // Create postCategories junction table
    await queryInterface.createTable("postCategories", {
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "posts",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
    await queryInterface.dropTable("postCategories");
    await queryInterface.dropTable("postTags");
    await queryInterface.dropTable("posts");
  },
};
