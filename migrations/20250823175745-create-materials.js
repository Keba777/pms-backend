"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("materials", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      warehouseId: { type: Sequelize.UUID, allowNull: false },
      item: { type: Sequelize.STRING, allowNull: false },
      type: { type: Sequelize.STRING },
      unit: { type: Sequelize.STRING, allowNull: false },
      quantity: { type: Sequelize.INTEGER },
      minQuantity: { type: Sequelize.INTEGER },
      reorderQuantity: { type: Sequelize.INTEGER },
      outOfStore: { type: Sequelize.INTEGER },
      rate: { type: Sequelize.DECIMAL(10, 2) },
      shelfNo: { type: Sequelize.STRING },
      status: {
        type: Sequelize.ENUM("Available", "Unavailable"),
        defaultValue: "Unavailable",
      },
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
    await queryInterface.dropTable("materials");
  },
};
