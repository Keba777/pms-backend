"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("task_members", {
      task_id: { type: Sequelize.UUID, allowNull: false },
      user_id: { type: Sequelize.UUID, allowNull: false },
    });
    await queryInterface.addConstraint("task_members", {
      fields: ["task_id", "user_id"],
      type: "primary key",
      name: "pk_task_members",
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("task_members");
  },
};
