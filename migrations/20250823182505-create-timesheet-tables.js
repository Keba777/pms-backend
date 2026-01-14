"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Labor Timesheets
    await queryInterface.createTable("labor_timesheets", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      morningIn: { type: Sequelize.STRING, allowNull: false },
      morningOut: { type: Sequelize.STRING, allowNull: false },
      mornHrs: { type: Sequelize.FLOAT, allowNull: false },
      bt: { type: Sequelize.FLOAT, defaultValue: 0 },
      afternoonIn: { type: Sequelize.STRING, allowNull: false },
      afternoonOut: { type: Sequelize.STRING, allowNull: false },
      aftHrs: { type: Sequelize.FLOAT, allowNull: false },
      ot: { type: Sequelize.FLOAT, defaultValue: 0 },
      dt: { type: Sequelize.FLOAT, defaultValue: 0 },
      rate: { type: Sequelize.FLOAT, allowNull: false },
      totalPay: { type: Sequelize.FLOAT, allowNull: false },
      status: {
        type: Sequelize.STRING,
        defaultValue: "Pending",
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

    // Equipment Timesheets
    await queryInterface.createTable("equipment_timesheets", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      equipmentId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "equipments", key: "id" },
        onDelete: "CASCADE",
      },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      morningIn: { type: Sequelize.STRING, allowNull: false },
      morningOut: { type: Sequelize.STRING, allowNull: false },
      mornHrs: { type: Sequelize.FLOAT, allowNull: false },
      bt: { type: Sequelize.FLOAT, defaultValue: 0 },
      afternoonIn: { type: Sequelize.STRING, allowNull: false },
      afternoonOut: { type: Sequelize.STRING, allowNull: false },
      aftHrs: { type: Sequelize.FLOAT, allowNull: false },
      ot: { type: Sequelize.FLOAT, defaultValue: 0 },
      dt: { type: Sequelize.FLOAT, defaultValue: 0 },
      rate: { type: Sequelize.FLOAT, allowNull: false },
      totalPay: { type: Sequelize.FLOAT, allowNull: false },
      status: {
        type: Sequelize.STRING,
        defaultValue: "Pending",
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

    // Material Balance Sheets
    await queryInterface.createTable("material_balance_sheets", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      materialId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "materials", key: "id" },
        onDelete: "CASCADE",
      },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      receivedQty: { type: Sequelize.INTEGER, allowNull: false },
      utilizedQty: { type: Sequelize.INTEGER, allowNull: false },
      balance: { type: Sequelize.INTEGER, allowNull: false },
      assignedTo: { type: Sequelize.STRING, allowNull: false },
      remark: { type: Sequelize.STRING, allowNull: true },
      status: { type: Sequelize.STRING, allowNull: false },
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("material_balance_sheets");
    await queryInterface.dropTable("equipment_timesheets");
    await queryInterface.dropTable("labor_timesheets");
  },
};
