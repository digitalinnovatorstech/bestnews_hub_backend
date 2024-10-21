("use strict");

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("tags", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      // description: {
      //   type: Sequelize.STRING,
      //   allowNull: true,
      // },
      // status: {
      //   type: Sequelize.ENUM("PUBLISHED", "DRAFT", "PENDING"),
      //   defaultValue: "PENDING",
      // },
      // permalink: {
      //   type: Sequelize.TEXT,
      //   allowNull: true,
      // },
      // isIndex: {
      //   type: Sequelize.BOOLEAN,
      //   defaultValue: false,
      //   allowNull: false,
      // },
      // metaTitle: {
      //   type: Sequelize.STRING,
      //   allowNull: true,
      // },
      // metaDescription: {
      //   type: Sequelize.STRING,
      //   allowNull: true,
      // },
      // _categories: {
      //   type: Sequelize.INTEGER,
      //   allowNull: true,
      //   references: {
      //     model: "categories",
      //     key: "id",
      //   },
      //   onUpdate: "CASCADE",
      //   onDelete: "SET NULL",
      // },
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
    await queryInterface.dropTable("tags");
  },
};
