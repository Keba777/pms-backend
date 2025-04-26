"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1) remove the old assignedTo column from tasks
    await queryInterface.removeColumn("tasks", "assignedTo");

    // 2) create the pivot table for the new many-to-many relation
    await queryInterface.createTable("task_members", {
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      task_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "tasks", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // 1) drop the pivot table
    await queryInterface.dropTable("task_members");

    // 2) re-add the assignedTo column if rolling back
    await queryInterface.addColumn("tasks", "assignedTo", {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: "users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },
};
