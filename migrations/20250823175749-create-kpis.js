"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("kpis", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      type: { type: Sequelize.ENUM("Labor", "Machinery"), allowNull: false },
      score: { type: Sequelize.INTEGER, allowNull: false },
      status: {
        type: Sequelize.ENUM("Bad", "Good", "V.Good", "Excellent"),
        allowNull: false,
      },
      remark: { type: Sequelize.TEXT },
      userLaborId: { type: Sequelize.UUID },
      laborInfoId: { type: Sequelize.UUID },
      equipmentId: { type: Sequelize.UUID },
      target: { type: Sequelize.INTEGER },
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
    await queryInterface.dropTable("kpis");
  },
};
