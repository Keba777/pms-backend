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
      siteId: { type: Sequelize.UUID, allowNull: false },
      unit: { type: Sequelize.STRING, allowNull: false },
      type: { type: Sequelize.STRING },
      manufacturer: { type: Sequelize.STRING },
      model: { type: Sequelize.STRING },
      year: { type: Sequelize.STRING },
      quantity: { type: Sequelize.INTEGER },
      minQuantity: { type: Sequelize.INTEGER },
      reorderQuantity: { type: Sequelize.INTEGER },
      outOfStore: { type: Sequelize.INTEGER },
      estimatedHours: { type: Sequelize.DECIMAL(8, 2) },
      rate: { type: Sequelize.DECIMAL(10, 2) },
      totalAmount: { type: Sequelize.DECIMAL(12, 2) },
      overTime: { type: Sequelize.DECIMAL(12, 2) },
      condition: { type: Sequelize.STRING },
      owner: {
        type: Sequelize.ENUM("Raycon", "Rental"),
        defaultValue: "Raycon",
      },
      status: {
        type: Sequelize.ENUM("Available", "Unavailable"),
        defaultValue: "Unavailable",
      },
      utilization_factor: { type: Sequelize.DECIMAL(8, 2) },
      total_time: { type: Sequelize.DECIMAL(8, 2) },
      starting_date: { type: Sequelize.DATE },
      due_date: { type: Sequelize.DATE },
      shifting_date: { type: Sequelize.DATE },
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
    await queryInterface.dropTable("equipments");
  },
};
