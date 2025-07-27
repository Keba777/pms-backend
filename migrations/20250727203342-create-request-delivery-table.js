"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("request_deliveries", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
        primaryKey: true,
      },
      approvalId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "approvals",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      refNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      recievedQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      deliveredBy: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      recievedBy: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      deliveryDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      siteId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "sites",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("Pending", "Delivered", "Cancelled"),
        allowNull: false,
        defaultValue: "Pending",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("request_deliveries");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_request_deliveries_status";'
    );
  },
};
