"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // remove the old ARRAY-UUID members column
    await queryInterface.removeColumn("projects", "members");
  },

  down: async (queryInterface, Sequelize) => {
    // re-create the ARRAY-UUID members column if you ever need to roll back
    await queryInterface.addColumn("projects", "members", {
      type: Sequelize.ARRAY(Sequelize.UUID),
      allowNull: true,
    });
  },
};
