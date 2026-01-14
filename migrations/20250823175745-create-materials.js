"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("materials", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      warehouseId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "warehouses", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      item: { type: Sequelize.STRING, allowNull: false },
      type: { type: Sequelize.STRING, allowNull: false },
      unit: { type: Sequelize.STRING, allowNull: false },
      quantity: { type: Sequelize.INTEGER, allowNull: true },
      minQuantity: { type: Sequelize.INTEGER, allowNull: true },
      reorderQuantity: { type: Sequelize.INTEGER, allowNull: true },
      outOfStore: { type: Sequelize.INTEGER, allowNull: true },
      rate: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      shelfNo: { type: Sequelize.STRING, allowNull: true },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "Unavailable",
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
    await queryInterface.dropTable("materials");
  },
};
