"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // add simple columns
    await queryInterface.addColumn("labor_informations", "position", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    // sex enum
    await queryInterface.addColumn("labor_informations", "sex", {
      type: Sequelize.ENUM("Male", "Female"),
      allowNull: true,
    });

    // terms enum
    await queryInterface.addColumn("labor_informations", "terms", {
      type: Sequelize.ENUM("Part Time", "Contract", "Temporary", "Permanent"),
      allowNull: true,
    });

    // estSalary
    await queryInterface.addColumn("labor_informations", "estSalary", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });

    // educationLevel
    await queryInterface.addColumn("labor_informations", "educationLevel", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("labor_informations", "educationLevel");
    await queryInterface.removeColumn("labor_informations", "estSalary");
    await queryInterface.removeColumn("labor_informations", "terms");
    await queryInterface.removeColumn("labor_informations", "sex");
    await queryInterface.removeColumn("labor_informations", "position");
    // Drop ENUM types if using Postgres
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_labor_informations_sex";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_labor_informations_terms";'
    );
  },
};
