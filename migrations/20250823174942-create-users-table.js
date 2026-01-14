"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      first_name: { type: Sequelize.STRING(50), allowNull: false },
      last_name: { type: Sequelize.STRING(50), allowNull: false },
      phone: { type: Sequelize.STRING(20), allowNull: true },
      role_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "roles", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      email: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      password: { type: Sequelize.STRING(255), allowNull: false },
      profile_picture: { type: Sequelize.STRING(255), allowNull: true },
      department_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "departments", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      siteId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "sites", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      orgId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "organizations", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      isStricted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      responsibilities: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("Active", "InActive"),
        defaultValue: "Active",
      },
      access: {
        type: Sequelize.ENUM("Low Access", "Full Access", "Average Access"),
        defaultValue: "Average Access",
      },
      username: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "Male",
      },
      position: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      terms: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      joiningDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      estSalary: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      ot: {
        type: Sequelize.FLOAT,
        allowNull: true,
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
    await queryInterface.dropTable("users");
  },
};
