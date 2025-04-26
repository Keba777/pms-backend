"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("activity_members", {
      activity_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "activities",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });
    await queryInterface.addConstraint("activity_members", {
      fields: ["activity_id", "user_id"],
      type: "primary key",
      name: "pk_activity_members",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("activity_members");
  },
};
