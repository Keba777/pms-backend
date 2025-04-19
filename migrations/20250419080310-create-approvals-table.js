"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("approvals", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      requestId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "requests",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      departmentId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "departments",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      stepOrder: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("Pending", "Approved", "Rejected"),
        allowNull: false,
        defaultValue: "Pending",
      },
      approvedBy: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      approvedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop the table ...
    await queryInterface.dropTable("approvals");
    // ... and clean up the Postgres ENUM type it created
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_approvals_status";'
    );
  },
};
