"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("task_members", {
      task_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "tasks",
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
    await queryInterface.addConstraint("task_members", {
      fields: ["task_id", "user_id"],
      type: "primary key",
      name: "pk_task_members",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("task_members");
  },
};
