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
      phone: { type: Sequelize.STRING(20), allowNull: false },
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
        allowNull: false,
        references: { model: "sites", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      responsiblities: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("Active", "InActive"),
        defaultValue: "Active",
      },
      access: {
        type: Sequelize.ENUM("Low Access", "Full Access", "Average Access"),
        defaultValue: "Average Access",
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
