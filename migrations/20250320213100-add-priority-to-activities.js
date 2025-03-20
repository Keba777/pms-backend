"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("activities", "priority", {
      type: Sequelize.ENUM("Critical", "High", "Medium", "Low"),
      allowNull: true, // You can set this to false if you want the column to be mandatory
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("activities", "priority");
  },
};
