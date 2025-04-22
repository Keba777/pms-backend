"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1) Drop unwanted columns
    await queryInterface.removeColumn("materials", "activityId");
    await queryInterface.removeColumn("materials", "requestId");
    await queryInterface.removeColumn("materials", "requestQuantity");

    // 2) Alter columns to be nullable
    await queryInterface.changeColumn("materials", "minQuantity", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.changeColumn("materials", "rate", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });
    await queryInterface.changeColumn("materials", "totalAmount", {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // 1) Re-add dropped columns
    await queryInterface.addColumn("materials", "activityId", {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: "activities", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    await queryInterface.addColumn("materials", "requestId", {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: "requests", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    await queryInterface.addColumn("materials", "requestQuantity", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    // 2) Revert columns to NOT NULL
    await queryInterface.changeColumn("materials", "minQuantity", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.changeColumn("materials", "rate", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    });
    await queryInterface.changeColumn("materials", "totalAmount", {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
    });
  },
};
