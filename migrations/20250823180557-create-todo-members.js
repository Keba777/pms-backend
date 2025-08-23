"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("todo_members", {
      todo_id: { type: Sequelize.UUID, allowNull: false },
      user_id: { type: Sequelize.UUID, allowNull: false },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
    await queryInterface.addConstraint("todo_members", {
      fields: ["todo_id", "user_id"],
      type: "primary key",
      name: "pk_todo_members",
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("todo_members");
  },
};
