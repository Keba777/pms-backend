"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("labors", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      role: { type: Sequelize.STRING, allowNull: false },
      siteId: { type: Sequelize.UUID, allowNull: false },
      unit: { type: Sequelize.STRING, allowNull: false },
      quantity: { type: Sequelize.INTEGER },
      minQuantity: { type: Sequelize.INTEGER },
      estimatedHours: { type: Sequelize.DECIMAL(8, 2) },
      rate: { type: Sequelize.DECIMAL(10, 2) },
      overtimeRate: { type: Sequelize.DECIMAL(10, 2) },
      totalAmount: { type: Sequelize.DECIMAL(12, 2) },
      skill_level: { type: Sequelize.STRING },
      responsible_person: { type: Sequelize.STRING },
      allocationStatus: {
        type: Sequelize.ENUM("Allocated", "Unallocated", "OnLeave"),
        defaultValue: "Unallocated",
      },
      status: {
        type: Sequelize.ENUM("Active", "InActive"),
        defaultValue: "InActive",
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
    await queryInterface.dropTable("labors");
  },
};
