"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("todo_progress", {
      todoId: { type: Sequelize.UUID, allowNull: false },
      userId: { type: Sequelize.UUID, allowNull: false },
      progress: { type: Sequelize.INTEGER, allowNull: false },
      remark: { type: Sequelize.TEXT },
      attachment: { type: Sequelize.ARRAY(Sequelize.STRING) },
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
  },
  async down(queryInterface) {
    await queryInterface.dropTable("todo_progress");
  },
};
