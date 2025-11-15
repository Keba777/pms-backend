"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add profile_picture column (nullable string)
    await queryInterface.addColumn("labor_informations", "profile_picture", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the column on rollback
    await queryInterface.removeColumn("labor_informations", "profile_picture");
  },
};
