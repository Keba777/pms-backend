"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("labors", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      role: { type: Sequelize.STRING, allowNull: false },
      siteId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "sites", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      unit: { type: Sequelize.STRING, allowNull: false },
      quantity: { type: Sequelize.INTEGER, allowNull: true },
      minQuantity: { type: Sequelize.INTEGER, allowNull: true },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "InActive",
      },
      responsiblePerson: {
        type: Sequelize.STRING,
        allowNull: true,
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
  },
  async down(queryInterface) {
    await queryInterface.dropTable("labors");
  },
};
