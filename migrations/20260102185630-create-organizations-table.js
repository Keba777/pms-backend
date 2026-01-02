'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('organizations', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      orgName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      logo: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      favicon: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      primaryColor: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      backgroundColor: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      cardColor: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      cardForegroundColor: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      popoverColor: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      popoverForegroundColor: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      primaryForegroundColor: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      secondaryColor: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      secondaryForegroundColor: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      mutedColor: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      mutedForegroundColor: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      accentColor: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      accentForegroundColor: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      destructiveColor: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      destructiveForegroundColor: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      borderColor: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('organizations');
  }
};
