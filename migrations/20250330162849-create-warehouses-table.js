"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("warehouses", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      equipment_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "equipments",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      owner: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      workingStatus: {
        type: Sequelize.ENUM("Operational", "Non-Operational"),
        allowNull: false,
      },
      currentWorkingSite: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      approvedBy: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      remark: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("Active", "Inactive", "Under Maintenance"),
        allowNull: false,
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("warehouses");
    // Drop enum types explicitly if needed (depending on your DB)
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_warehouses_workingStatus";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_warehouses_status";'
    );
  },
};
