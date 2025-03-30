"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("equipments", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      item: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      rate_with_vat: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      reorder_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      min_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      manufacturer: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      eqp_condition: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      activity_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "activities",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("equipments");
  },
};
