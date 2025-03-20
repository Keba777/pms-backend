'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable('projects');

    if (!tableDescription.priority) {
      await queryInterface.addColumn('projects', 'priority', {
        type: Sequelize.ENUM('Critical', 'High', 'Medium', 'Low'),
        allowNull: false,
      });
    }

    if (!tableDescription.start_date) {
      await queryInterface.addColumn('projects', 'start_date', {
        type: Sequelize.DATE,
        allowNull: false,
      });
    }

    if (!tableDescription.end_date) {
      await queryInterface.addColumn('projects', 'end_date', {
        type: Sequelize.DATE,
        allowNull: false,
      });
    }

    if (!tableDescription.budget) {
      await queryInterface.addColumn('projects', 'budget', {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      });
    }

    if (!tableDescription.client) {
      await queryInterface.addColumn('projects', 'client', {
        type: Sequelize.STRING(100),
        allowNull: false,
      });
    }

    if (!tableDescription.site) {
      await queryInterface.addColumn('projects', 'site', {
        type: Sequelize.STRING(100),
        allowNull: false,
      });
    }

    if (!tableDescription.progress) {
      await queryInterface.addColumn('projects', 'progress', {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      });
    }

    if (!tableDescription.isFavourite) {
      await queryInterface.addColumn('projects', 'isFavourite', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      });
    }

    if (!tableDescription.status) {
      await queryInterface.addColumn('projects', 'status', {
        type: Sequelize.ENUM('Not Started', 'Started', 'InProgress', 'Canceled', 'Onhold', 'Completed'),
        allowNull: false,
      });
    }

    if (!tableDescription.members) {
      await queryInterface.addColumn('projects', 'members', {
        type: Sequelize.ARRAY(Sequelize.UUID),
        allowNull: true,
      });
    }

    if (!tableDescription.tagIds) {
      await queryInterface.addColumn('projects', 'tagIds', {
        type: Sequelize.ARRAY(Sequelize.UUID),
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('projects', 'priority');
    await queryInterface.removeColumn('projects', 'start_date');
    await queryInterface.removeColumn('projects', 'end_date');
    await queryInterface.removeColumn('projects', 'budget');
    await queryInterface.removeColumn('projects', 'client');
    await queryInterface.removeColumn('projects', 'site');
    await queryInterface.removeColumn('projects', 'progress');
    await queryInterface.removeColumn('projects', 'isFavourite');
    await queryInterface.removeColumn('projects', 'status');
    await queryInterface.removeColumn('projects', 'members');
    await queryInterface.removeColumn('projects', 'tagIds');
  }
};