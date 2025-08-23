"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("activities", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      activity_name: { type: Sequelize.STRING(100), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      task_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "tasks", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      priority: {
        type: Sequelize.ENUM("Critical", "High", "Medium", "Low"),
        defaultValue: "Medium",
        allowNull: false,
      },
      quantity: { type: Sequelize.INTEGER, defaultValue: 0, allowNull: true },
      unit: { type: Sequelize.STRING(50), allowNull: false },
      start_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      end_date: { type: Sequelize.DATE, allowNull: false },
      progress: { type: Sequelize.INTEGER, defaultValue: 0, allowNull: false },
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
      image: { type: Sequelize.STRING(255), allowNull: true },
      labor_index_factor: { type: Sequelize.FLOAT, allowNull: true },
      labor_utilization_factor: { type: Sequelize.FLOAT, allowNull: true },
      labor_working_hours_per_day: { type: Sequelize.FLOAT, allowNull: true },
      machinery_index_factor: { type: Sequelize.FLOAT, allowNull: true },
      machinery_utilization_factor: { type: Sequelize.FLOAT, allowNull: true },
      machinery_working_hours_per_day: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      work_force: { type: Sequelize.JSONB, allowNull: true },
      machinery_list: { type: Sequelize.JSONB, allowNull: true },
      materials_list: { type: Sequelize.JSONB, allowNull: true },
      checked_by_name: { type: Sequelize.STRING(100), allowNull: true },
      checked_by_date: { type: Sequelize.DATE, allowNull: true },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("activities");
  },
};
