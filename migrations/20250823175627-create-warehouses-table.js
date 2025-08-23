"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("warehouses", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      type: { type: Sequelize.STRING, allowNull: false },
      siteId: { type: Sequelize.UUID, allowNull: false },
      owner: { type: Sequelize.STRING, allowNull: false },
      workingStatus: {
        type: Sequelize.ENUM("Operational", "Non-Operational"),
        allowNull: false,
      },
      approvedBy: { type: Sequelize.STRING },
      remark: { type: Sequelize.TEXT },
      status: {
        type: Sequelize.ENUM("Active", "Inactive", "Under Maintenance"),
        allowNull: false,
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
    await queryInterface.dropTable("warehouses");
  },
};
