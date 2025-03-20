"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("activities", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      activity_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      task_id: {
        type: Sequelize.UUID,
        references: {
          model: "tasks", // Assuming the 'tasks' table exists
          key: "id",
        },
        allowNull: false,
      },
      priority: {
        type: Sequelize.ENUM("Critical", "High", "Medium", "Low"),
        defaultValue: "Medium",
        allowNull: false,
      },
      unit: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      progress: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
        defaultValue: "Not Started",
        allowNull: false,
      },
      approvalStatus: {
        type: Sequelize.ENUM("Approved", "Not Approved", "Pending"),
        defaultValue: "Pending",
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("activities");
  },
};
