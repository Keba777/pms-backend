"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("dispatches", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      approvalId: { type: Sequelize.UUID, allowNull: false },
      refNumber: { type: Sequelize.STRING },
      totalTransportCost: { type: Sequelize.INTEGER, allowNull: false },
      estArrivalTime: { type: Sequelize.DATE, allowNull: false },
      depatureSiteId: { type: Sequelize.UUID, allowNull: false },
      arrivalSiteId: { type: Sequelize.UUID, allowNull: false },
      remarks: { type: Sequelize.TEXT },
      dispatchedDate: { type: Sequelize.DATE, allowNull: false },
      driverName: { type: Sequelize.STRING },
      vehicleNumber: { type: Sequelize.STRING },
      vehicleType: { type: Sequelize.STRING },
      dispatchedBy: { type: Sequelize.ENUM("Plane", "Truck") },
      status: {
        type: Sequelize.ENUM("Pending", "In Transit", "Delivered", "Cancelled"),
        allowNull: false,
        defaultValue: "Pending",
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
    await queryInterface.dropTable("dispatches");
  },
};
