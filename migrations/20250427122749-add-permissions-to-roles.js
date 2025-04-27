'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'roles',         // name of the existing table
      'permissions',   // name of the new column
      {
        type: Sequelize.JSON,   // or JSONB if you prefer Postgres JSONB
        allowNull: true,        // can be null
        defaultValue: null,     // default to null
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'roles',       // table name
      'permissions'  // column to remove
    );
  }
};
