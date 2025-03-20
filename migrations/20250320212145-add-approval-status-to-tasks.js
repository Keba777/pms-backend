"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("tasks", "approvalStatus", {
      type: Sequelize.STRING,
      allowNull: true, // Adjust this based on whether it's required or not
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("tasks", "approvalStatus");
  },
};
