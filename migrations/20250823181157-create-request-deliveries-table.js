"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("request_deliveries", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      approvalId: { type: Sequelize.UUID, allowNull: false },
      refNumber: { type: Sequelize.STRING },
      recievedQuantity: { type: Sequelize.INTEGER, allowNull: false },
      deliveredBy: { type: Sequelize.STRING, allowNull: false },
      recievedBy: { type: Sequelize.STRING, allowNull: false },
      deliveryDate: { type: Sequelize.DATE, allowNull: false },
      siteId: { type: Sequelize.UUID, allowNull: false },
      remarks: { type: Sequelize.TEXT },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "Pending",
      },
      orgId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "organizations", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("request_deliveries");
  },
};
