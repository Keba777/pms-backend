"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("todos", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
        primaryKey: true,
        allowNull: false,
      },
      task: { type: Sequelize.STRING, allowNull: false },
      type: { type: Sequelize.STRING, allowNull: false },
      priority: {
        type: Sequelize.ENUM("Urgent", "High", "Medium", "Low"),
        allowNull: false,
      },
      assignedById: { type: Sequelize.UUID, allowNull: false },
      givenDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      dueDate: { type: Sequelize.DATE, allowNull: false },
      target: { type: Sequelize.DATE, allowNull: false },
      kpiId: { type: Sequelize.UUID, allowNull: false },
      departmentId: { type: Sequelize.UUID, allowNull: false },
      status: {
        type: Sequelize.ENUM(
          "Not Started",
          "In progress",
          "Pending",
          "Completed"
        ),
        allowNull: false,
        defaultValue: "Not Started",
      },
      progress: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      remark: { type: Sequelize.TEXT },
      remainder: { type: Sequelize.STRING },
      attachment: { type: Sequelize.ARRAY(Sequelize.STRING) },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
    });

    await queryInterface.createTable("todo_progress", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
        primaryKey: true,
        allowNull: false,
      },
      todoId: { type: Sequelize.UUID, allowNull: false },
      userId: { type: Sequelize.UUID, allowNull: false },
      progress: { type: Sequelize.INTEGER, allowNull: false },
      remark: { type: Sequelize.TEXT },
      attachment: { type: Sequelize.ARRAY(Sequelize.STRING) },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
    });

    await queryInterface.createTable("todo_members", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
        primaryKey: true,
        allowNull: false,
      },
      todo_id: { type: Sequelize.UUID, allowNull: false },
      user_id: { type: Sequelize.UUID, allowNull: false },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("todo_members");
    await queryInterface.dropTable("todo_progress");
    await queryInterface.dropTable("todos");
  },
};
