"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add the missing column(s) to the 'projects' table
    await queryInterface.addColumn("projects", "description", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // You can add other missing columns here if needed
  },

  async down(queryInterface, Sequelize) {
    // Revert the changes (drop the 'description' column)
    await queryInterface.removeColumn("projects", "description");

    // You can remove other columns here if needed
  },
};
