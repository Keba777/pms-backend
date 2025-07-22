"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("labors", "responsible_person", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("labors", "utilization_factor", {
      type: Sequelize.DECIMAL(8, 2),
      allowNull: true,
    });

    await queryInterface.addColumn("labors", "total_time", {
      type: Sequelize.DECIMAL(8, 2),
      allowNull: true,
    });

    await queryInterface.addColumn("labors", "starting_date", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("labors", "due_date", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("labors", "shifting_date", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("labors", "responsible_person");
    await queryInterface.removeColumn("labors", "utilization_factor");
    await queryInterface.removeColumn("labors", "total_time");
    await queryInterface.removeColumn("labors", "starting_date");
    await queryInterface.removeColumn("labors", "due_date");
    await queryInterface.removeColumn("labors", "shifting_date");
  },
};
