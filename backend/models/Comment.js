'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
          name: 'userId'
        }, 
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      Comment.belongsTo(models.Publication, {
        foreignKey: {
          allowNull: false,
          name: 'publicationId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });
    }
  };
  Comment.init({
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
    commentContent: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};