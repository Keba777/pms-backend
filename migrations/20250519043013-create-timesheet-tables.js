"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Labor Timesheet
    await queryInterface.createTable("labor_timesheets", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
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
        type: Sequelize.ENUM("Pending", "Approved", "Rejected"),
        defaultValue: "Pending",
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // Equipment Timesheet
    await queryInterface.createTable("equipment_timesheets", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      equipmentId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "equipments", key: "id" },
        onUpdate: "CASCADE",
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
        type: Sequelize.ENUM("Pending", "Approved", "Rejected"),
        defaultValue: "Pending",
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // Material Balance Timesheet
    await queryInterface.createTable("material_balance_timesheets", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      materialId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "materials", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      receivedQty: { type: Sequelize.INTEGER, allowNull: false },
      utilizedQty: { type: Sequelize.INTEGER, allowNull: false },
      balance: { type: Sequelize.INTEGER, allowNull: false },
      assignedTo: { type: Sequelize.STRING, allowNull: false },
      remark: { type: Sequelize.STRING },
      status: { type: Sequelize.STRING, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("material_balance_timesheets");
    await queryInterface.dropTable("equipment_timesheets");
    await queryInterface.dropTable("labor_timesheets");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_labor_timesheets_status";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_equipment_timesheets_status";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_material_balance_timesheets_status";'
    );
  },
};
