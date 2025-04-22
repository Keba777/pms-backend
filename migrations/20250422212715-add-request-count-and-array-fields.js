"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // add numeric counts
    await queryInterface.addColumn("requests", "materialCount", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn("requests", "laborCount", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn("requests", "equipmentCount", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // add UUID‑array columns
    await queryInterface.addColumn("requests", "laborIds", {
      type: Sequelize.ARRAY(Sequelize.UUID),
      allowNull: true,
    });
    await queryInterface.addColumn("requests", "materialIds", {
      type: Sequelize.ARRAY(Sequelize.UUID),
      allowNull: true,
    });
    await queryInterface.addColumn("requests", "equipmentIds", {
      type: Sequelize.ARRAY(Sequelize.UUID),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // remove in reverse order
    await queryInterface.removeColumn("requests", "equipmentIds");
    await queryInterface.removeColumn("requests", "materialIds");
    await queryInterface.removeColumn("requests", "laborIds");

    await queryInterface.removeColumn("requests", "equipmentCount");
    await queryInterface.removeColumn("requests", "laborCount");
    await queryInterface.removeColumn("requests", "materialCount");
  },
};
