"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("project_members", {
      project_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "projects",
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
    // optionally add a composite PK or unique constraint:
    await queryInterface.addConstraint("project_members", {
      fields: ["project_id", "user_id"],
      type: "primary key",
      name: "pk_project_members",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("project_members");
  },
};
