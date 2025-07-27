"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("dispatches", {
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
      totalTransportCost: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      estArrivalTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      depatureSiteId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "sites",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      arrivalSiteId: {
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
      dispatchedDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      driverName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      vehicleNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      vehicleType: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dispatchedBy: {
        type: Sequelize.ENUM("Plane", "Truck"),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("Pending", "In Transit", "Delivered", "Cancelled"),
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
    await queryInterface.dropTable("dispatches");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_dispatches_dispatchedBy";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_dispatches_status";'
    );
  },
};
