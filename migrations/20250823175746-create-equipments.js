"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("equipments", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      item: { type: Sequelize.STRING, allowNull: false },
      siteId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "sites", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      unit: { type: Sequelize.STRING, allowNull: false },
      type: { type: Sequelize.STRING, allowNull: true },
      manufacturer: { type: Sequelize.STRING, allowNull: true },
      model: { type: Sequelize.STRING, allowNull: true },
      year: { type: Sequelize.STRING, allowNull: true },
      quantity: { type: Sequelize.INTEGER, allowNull: true },
      minQuantity: { type: Sequelize.INTEGER, allowNull: true },
      reorderQuantity: { type: Sequelize.INTEGER, allowNull: true },
      outOfStore: { type: Sequelize.INTEGER, allowNull: true },
      estimatedHours: { type: Sequelize.DECIMAL(8, 2), allowNull: true },
      rate: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      totalAmount: { type: Sequelize.DECIMAL(12, 2), allowNull: true },
      overTime: { type: Sequelize.DECIMAL(12, 2), allowNull: true },
      condition: { type: Sequelize.STRING, allowNull: true },
      owner: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "Raycon",
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "Unavailable",
      },
      utilization_factor: { type: Sequelize.DECIMAL(8, 2), allowNull: true },
      total_time: { type: Sequelize.DECIMAL(8, 2), allowNull: true },
      starting_date: { type: Sequelize.DATE, allowNull: true },
      due_date: { type: Sequelize.DATE, allowNull: true },
      shifting_date: { type: Sequelize.DATE, allowNull: true },
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
    await queryInterface.dropTable("equipments");
  },
};
