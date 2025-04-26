"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the activityId foreign‐key column to requests
    await queryInterface.addColumn("requests", "activityId", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "activities",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove activityId if you roll this migration back
    await queryInterface.removeColumn("requests", "activityId");
  },
};
