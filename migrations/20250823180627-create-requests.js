"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("requests", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: { type: Sequelize.UUID, allowNull: false },
      departmentId: { type: Sequelize.UUID },
      siteId: {
        type: Sequelize.UUID,
        defaultValue: "3269c7c0-a303-438e-bee4-71f5bdec22b2",
      },
      activityId: { type: Sequelize.UUID },
      materialCount: { type: Sequelize.INTEGER },
      laborCount: { type: Sequelize.INTEGER },
      equipmentCount: { type: Sequelize.INTEGER },
      status: {
        type: Sequelize.ENUM("Pending", "In Progress", "Completed", "Rejected"),
        defaultValue: "Pending",
      },
      priority: { type: Sequelize.ENUM("Urgent", "Medium", "Low") },
      laborIds: { type: Sequelize.ARRAY(Sequelize.UUID) },
      materialIds: { type: Sequelize.ARRAY(Sequelize.UUID) },
      equipmentIds: { type: Sequelize.ARRAY(Sequelize.UUID) },
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
    await queryInterface.dropTable("requests");
  },
};
