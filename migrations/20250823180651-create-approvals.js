"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("approvals", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      requestId: { type: Sequelize.UUID, allowNull: false },
      departmentId: { type: Sequelize.UUID, allowNull: false },
      stepOrder: { type: Sequelize.INTEGER, allowNull: false },
      status: {
        type: Sequelize.ENUM("Pending", "Approved", "Rejected"),
        defaultValue: "Pending",
      },
      approvedBy: { type: Sequelize.UUID },
      approvedAt: { type: Sequelize.DATE },
      checkedBy: { type: Sequelize.UUID },
      remarks: { type: Sequelize.TEXT },
      prevDepartmentId: { type: Sequelize.UUID },
      nextDepartmentId: { type: Sequelize.UUID },
      finalDepartment: { type: Sequelize.BOOLEAN },
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
    await queryInterface.dropTable("approvals");
  },
};
