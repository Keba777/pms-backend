'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1) Drop unwanted columns
    await queryInterface.removeColumn('equipments', 'activityId');
    await queryInterface.removeColumn('equipments', 'requestId');
    await queryInterface.removeColumn('equipments', 'requestQuantity');

    // 2) Alter existing columns to be optional
    await queryInterface.changeColumn('equipments', 'minQuantity', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.changeColumn('equipments', 'estimatedHours', {
      type: Sequelize.DECIMAL(8, 2),
      allowNull: true,
    });
    await queryInterface.changeColumn('equipments', 'rate', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });
    await queryInterface.changeColumn('equipments', 'totalAmount', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // 1) Re-add columns
    await queryInterface.addColumn('equipments', 'activityId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: 'activities', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    await queryInterface.addColumn('equipments', 'requestId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: 'requests', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    await queryInterface.addColumn('equipments', 'requestQuantity', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    // 2) Revert columns to NOT NULL
    await queryInterface.changeColumn('equipments', 'minQuantity', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.changeColumn('equipments', 'estimatedHours', {
      type: Sequelize.DECIMAL(8, 2),
      allowNull: false,
    });
    await queryInterface.changeColumn('equipments', 'rate', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    });
    await queryInterface.changeColumn('equipments', 'totalAmount', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
    });
  },
};