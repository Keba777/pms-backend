"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("projects", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      title: { type: Sequelize.STRING(100), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      priority: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      start_date: { type: Sequelize.DATE, allowNull: false },
      end_date: { type: Sequelize.DATE, allowNull: false },
      budget: { type: Sequelize.DECIMAL(20, 2), allowNull: false },
      site_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "sites", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      client_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "clients", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      orgId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "organizations", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      progress: { type: Sequelize.INTEGER, defaultValue: 0 },
      isFavourite: { type: Sequelize.BOOLEAN, defaultValue: false },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tagIds: { type: Sequelize.ARRAY(Sequelize.UUID), allowNull: true },
      attachments: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
        defaultValue: [],
      },
      actuals: { type: Sequelize.JSONB, defaultValue: {}, allowNull: false },
      progressUpdates: { type: Sequelize.JSONB, allowNull: true },

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
    await queryInterface.dropTable("projects");
  },
};
