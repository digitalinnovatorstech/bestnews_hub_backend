module.exports = (sequelize, DataTypes) => {
  const FAQ = sequelize.define(
    "faq",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      answer: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      _post: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "posts",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      _page: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "pages",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      tableName: "faq",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "_post",
          using: "BTREE",
          fields: [{ name: "_post" }],
        },
        {
          name: "_page",
          using: "BTREE",
          fields: [{ name: "_page" }],
        },
      ],
    }
  );
  return FAQ;
};
