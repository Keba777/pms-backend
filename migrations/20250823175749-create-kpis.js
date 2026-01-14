"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("kpis", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      type: { type: Sequelize.STRING, allowNull: false },
      score: { type: Sequelize.INTEGER, allowNull: false },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      remark: { type: Sequelize.TEXT },
      userLaborId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      laborInfoId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "labor_informations", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      equipmentId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "equipments", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      target: { type: Sequelize.INTEGER },
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
    await queryInterface.dropTable("kpis");
  },
};
