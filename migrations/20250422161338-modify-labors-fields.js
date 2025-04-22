"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1) Remove unwanted columns
    await queryInterface.removeColumn("labors", "activity_id");
    await queryInterface.removeColumn("labors", "requestId");
    await queryInterface.removeColumn("labors", "requestQuantity");

    // 2) Make fields nullable
    await queryInterface.changeColumn("labors", "minQuantity", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.changeColumn("labors", "estimatedHours", {
      type: Sequelize.DECIMAL(8, 2),
      allowNull: true,
    });
    await queryInterface.changeColumn("labors", "rate", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });
    await queryInterface.changeColumn("labors", "totalAmount", {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // 1) Re-add removed columns
    await queryInterface.addColumn("labors", "activity_id", {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: "activities", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    await queryInterface.addColumn("labors", "requestId", {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: "requests", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    await queryInterface.addColumn("labors", "requestQuantity", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    // 2) Revert nullable changes
    await queryInterface.changeColumn("labors", "minQuantity", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.changeColumn("labors", "estimatedHours", {
      type: Sequelize.DECIMAL(8, 2),
      allowNull: false,
    });
    await queryInterface.changeColumn("labors", "rate", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    });
    await queryInterface.changeColumn("labors", "totalAmount", {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
    });
  },
};
