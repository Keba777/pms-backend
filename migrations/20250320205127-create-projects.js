"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("projects", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      priority: {
        type: Sequelize.ENUM("Critical", "High", "Medium", "Low"),
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      budget: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      client: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      site: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      progress: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      isFavourite: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(
          "Not Started",
          "Started",
          "InProgress",
          "Canceled",
          "Onhold",
          "Completed"
        ),
        allowNull: false,
      },
      members: {
        type: Sequelize.ARRAY(Sequelize.UUID),
        allowNull: true,
      },
      tagIds: {
        type: Sequelize.ARRAY(Sequelize.UUID),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("projects");
  },
};
