'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Like.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
          name: 'userId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });
      Like.belongsTo(models.Publication, {
        foreignKey: {
          allowNull: false,
          name: 'publicationId'
        },
        onUpdate: 'CASCADE',
        onDelete: "CASCADE"
      });
    }
  };
  Like.init({
    userId: {
      type:DataTypes.INTEGER.UNSIGNED,
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
    rate: {
      type: DataTypes.TINYINT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Like',
  });
  return Like;
};