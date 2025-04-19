"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("requests", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      reqNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
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
      status: {
        type: Sequelize.ENUM("Pending", "In Progress", "Completed", "Rejected"),
        allowNull: false,
        defaultValue: "Pending",
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
    await queryInterface.dropTable("requests");
    // ... and clean up the Postgres ENUM type it created
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_requests_status";'
    );
  },
};
