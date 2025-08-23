"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("project_members", {
      project_id: { type: Sequelize.UUID, allowNull: false },
      user_id: { type: Sequelize.UUID, allowNull: false },
    });
    await queryInterface.addConstraint("project_members", {
      fields: ["project_id", "user_id"],
      type: "primary key",
      name: "pk_project_members",
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("project_members");
  },
};
