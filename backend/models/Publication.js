'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Publication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Publication.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
          name: 'userId'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      Publication.hasMany(models.Comment);
      Publication.hasMany(models.Like);
      Publication.hasMany(models.Notification);
    }
  };
  Publication.init({
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: {
          tableName: 'Users',
          schema: 'Groupomania'
        },
        key: 'id'
      },
      allowNull: false
    },
    publiContent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rate: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Publication',
  });
  return Publication;
};