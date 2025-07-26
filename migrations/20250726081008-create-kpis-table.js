"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop if it exists to ensure from scratch
    await queryInterface.dropTable("kpis");

    await queryInterface.createTable("kpis", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
        primaryKey: true,
      },
      type: {
        type: Sequelize.ENUM("Labor", "Machinery"),
        allowNull: false,
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("Bad", "Good", "V.Good", "Excellent"),
        allowNull: false,
      },
      remark: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      userLaborId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      laborInfoId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "labor_informations",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      equipmentId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "equipments",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      target: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("kpis");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_kpis_type";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_kpis_status";'
    );
  },
};
