"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDesc = await queryInterface.describeTable("equipments");

    // 1) DROP legacy columns if they exist (customize as needed)
    if (tableDesc.total_equipment) {
      await queryInterface.removeColumn("equipments", "total_equipment");
    }

    // 2) ADD new columns if not present
    if (!tableDesc.activityId) {
      await queryInterface.addColumn("equipments", "activityId", {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "activities", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }

    if (!tableDesc.requestId) {
      await queryInterface.addColumn("equipments", "requestId", {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "requests", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }

    if (!tableDesc.item) {
      await queryInterface.addColumn("equipments", "item", {
        type: Sequelize.STRING,
        allowNull: false,
      });
    }

    if (!tableDesc.unit) {
      await queryInterface.addColumn("equipments", "unit", {
        type: Sequelize.STRING,
        allowNull: false,
      });
    }

    if (!tableDesc.requestQuantity) {
      await queryInterface.addColumn("equipments", "requestQuantity", {
        type: Sequelize.INTEGER,
        allowNull: false,
      });
    }

    if (!tableDesc.minQuantity) {
      await queryInterface.addColumn("equipments", "minQuantity", {
        type: Sequelize.INTEGER,
        allowNull: false,
      });
    }

    if (!tableDesc.estimatedHours) {
      await queryInterface.addColumn("equipments", "estimatedHours", {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: false,
      });
    }

    if (!tableDesc.rate) {
      await queryInterface.addColumn("equipments", "rate", {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      });
    }

    if (!tableDesc.totalAmount) {
      await queryInterface.addColumn("equipments", "totalAmount", {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableDesc = await queryInterface.describeTable("equipments");

    for (const col of [
      "totalAmount",
      "rate",
      "estimatedHours",
      "minQuantity",
      "requestQuantity",
      "unit",
      "item",
      "requestId",
      "activityId",
    ]) {
      if (tableDesc[col]) {
        await queryInterface.removeColumn("equipments", col);
      }
    }

    // Restore legacy column if needed
    if (!tableDesc.total_equipment) {
      await queryInterface.addColumn("equipments", "total_equipment", {
        type: Sequelize.INTEGER,
        allowNull: false,
      });
    }
  },
};
