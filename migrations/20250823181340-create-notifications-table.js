"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("notifications", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      type: { type: Sequelize.STRING, allowNull: false },
      data: { type: Sequelize.JSONB },
      read: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false },
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
  },
  async down(queryInterface) {
    await queryInterface.dropTable("notifications");
  },
};
