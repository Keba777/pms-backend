"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("tasks", "description", {
      type: Sequelize.STRING,
      allowNull: true, // or false if the column is required
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("tasks", "description");
  },
};
