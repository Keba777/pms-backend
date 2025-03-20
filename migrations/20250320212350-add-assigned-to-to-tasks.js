"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("tasks", "assignedTo", {
      type: Sequelize.INTEGER, // Assuming it's a foreign key to a 'users' table or similar
      allowNull: true, // Adjust if the column should be non-nullable
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("tasks", "assignedTo");
  },
};
