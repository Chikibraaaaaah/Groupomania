'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Likes', {
      id: {
        autoIncrement: true,
        unique: true,
        allowNull: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      userId: {
        type:Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: {
            tableName: 'Users'
          },
          key: 'id'
        }
      },
      publicationId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: {
            tableName: 'Publications'
          },
          key: 'id'
        }
      },
      rate: {
        type: Sequelize.TINYINT,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Likes');
  }
};