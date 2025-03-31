"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add the financial_status column to equipments table
    await queryInterface.addColumn("equipments", "financial_status", {
      type: Sequelize.ENUM("Approved", "Not Approved"),
      allowNull: true,
    });

    // Add the financial_status column to labors table
    await queryInterface.addColumn("labors", "financial_status", {
      type: Sequelize.ENUM("Approved", "Not Approved"),
      allowNull: true,
    });

    // Add the financial_status column to materials table
    await queryInterface.addColumn("materials", "financial_status", {
      type: Sequelize.ENUM("Approved", "Not Approved"),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the financial_status column from equipments table
    await queryInterface.removeColumn("equipments", "financial_status");

    // Remove the financial_status column from labors table
    await queryInterface.removeColumn("labors", "financial_status");

    // Remove the financial_status column from materials table
    await queryInterface.removeColumn("materials", "financial_status");

    // Optionally, drop the ENUM types if using PostgreSQL.
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_equipments_financial_status";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_labors_financial_status";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_materials_financial_status";'
    );
  },
};
