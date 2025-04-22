"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Ensure UUID extension for Postgres
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    );

    // Drop existing table if it exists (optional)
    // await queryInterface.dropTable('requests', { cascade: true });

    // Create the requests table with new columns
    await queryInterface.createTable("requests", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      // Three optional reqNumber variants
      materialReqNumber: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      laborReqNumber: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      equipmentReqNumber: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },

      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      departmentId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "departments", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      status: {
        type: Sequelize.ENUM("Pending", "In Progress", "Completed", "Rejected"),
        allowNull: false,
        defaultValue: "Pending",
      },

      laborIds: {
        type: Sequelize.ARRAY(Sequelize.UUID),
        allowNull: true,
      },
      materialIds: {
        type: Sequelize.ARRAY(Sequelize.UUID),
        allowNull: true,
      },
      equipmentIds: {
        type: Sequelize.ARRAY(Sequelize.UUID),
        allowNull: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });
  },

  async down(queryInterface) {
    // Drop the table
    await queryInterface.dropTable("requests");
    // Clean up ENUM type
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_requests_status";'
    );
  },
};
