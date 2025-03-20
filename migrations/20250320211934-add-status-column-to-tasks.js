'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('tasks', 'status', {
      type: Sequelize.ENUM('Not Started', 'Started', 'InProgress', 'Canceled', 'Onhold', 'Completed'),
      defaultValue: 'Not Started'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('tasks', 'status');
  }
};
