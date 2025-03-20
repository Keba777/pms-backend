"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tasks", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      task_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      project_id: {
        type: Sequelize.UUID,
        references: {
          model: "projects", // Assuming you already have the projects table
          key: "id",
        },
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
      progress: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true,
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
        defaultValue: "Not Approved",
        allowNull: false,
      },
      assignedTo: {
        type: Sequelize.UUID,
        references: {
          model: "users", // Assuming you have a users table
          key: "id",
        },
        allowNull: true,
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
    await queryInterface.dropTable("tasks");
  },
};
