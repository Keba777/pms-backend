"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adding new columns to the activities table.
    await queryInterface.addColumn("activities", "quantity", {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    });
    await queryInterface.addColumn("activities", "materials", {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn("activities", "equipment", {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn("activities", "labors", {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Removing the added columns in reverse order.
    await queryInterface.removeColumn("activities", "labors");
    await queryInterface.removeColumn("activities", "equipment");
    await queryInterface.removeColumn("activities", "materials");
    await queryInterface.removeColumn("activities", "quantity");
  },
};
