'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Notification.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
          name: 'userId'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
      Notification.belongsTo(models.Publication, {
        foreignKey: {
          allowNull: false,
          name: 'publicationId'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
    }
  };
  Notification.init({
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: {
          tableName: 'Users',
          schema: 'Groupomania'
        },
        key: 'id'
      }
    },
    publicationId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: {
          tableName: 'Publications',
          schema: 'Groupomania'
        },
        key: 'id'
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};