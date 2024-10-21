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
