"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("store_requisitions", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      description: { type: Sequelize.TEXT },
      unitOfMeasure: { type: Sequelize.STRING, allowNull: false },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      remarks: { type: Sequelize.TEXT },
      approvalId: { type: Sequelize.UUID, allowNull: false },
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
    await queryInterface.dropTable("store_requisitions");
  },
};
