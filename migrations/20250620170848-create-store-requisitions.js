'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // If you need the uuid-ossp extension for Postgres, uncomment:
    // await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    await queryInterface.createTable('store_requisitions', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      unitOfMeasure: {
        type: Sequelize.STRING,
        allowNull: false
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      approvalId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'approvals',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('store_requisitions');
  }
};
