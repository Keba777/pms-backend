"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Use a transaction so all changes succeed or all rollback together
    await queryInterface.sequelize.transaction(async (transaction) => {
      // activities: add progressUpdates JSONB column
      await queryInterface.addColumn(
        "activities",
        "progressUpdates",
        {
          type: Sequelize.JSONB,
          allowNull: true,
        },
        { transaction }
      );

      // tasks: add progressUpdates JSONB column
      await queryInterface.addColumn(
        "tasks",
        "progressUpdates",
        {
          type: Sequelize.JSONB,
          allowNull: true,
        },
        { transaction }
      );

      // projects: add progressUpdates JSONB column
      await queryInterface.addColumn(
        "projects",
        "progressUpdates",
        {
          type: Sequelize.JSONB,
          allowNull: true,
        },
        { transaction }
      );

    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the columns inside a transaction
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Note: removeColumn will no-op if column doesn't exist in many adapters,
      // but we still call them in reverse order.
      await queryInterface.removeColumn("projects", "progressUpdates", { transaction }).catch(() => {});
      await queryInterface.removeColumn("tasks", "progressUpdates", { transaction }).catch(() => {});
      await queryInterface.removeColumn("activities", "progressUpdates", { transaction }).catch(() => {});
    });
  },
};
