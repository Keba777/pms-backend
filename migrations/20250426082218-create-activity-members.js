"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1) Create the pivot table for Activity ↔ User
    await queryInterface.createTable("activity_members", {
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      activity_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "activities", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop the pivot table on rollback
    await queryInterface.dropTable("activity_members");
  },
};
