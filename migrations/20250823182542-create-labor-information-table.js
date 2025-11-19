"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("labor_informations", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      firstName: { type: Sequelize.STRING, allowNull: false },
      lastName: { type: Sequelize.STRING, allowNull: false },
      laborId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "labors", key: "id" },
        onDelete: "CASCADE",
      },
      startsAt: { type: Sequelize.DATE, allowNull: false },
      endsAt: { type: Sequelize.DATE, allowNull: false },
      status: {
        type: Sequelize.ENUM("Allocated", "Unallocated"),
        allowNull: false,
      },
      // New field
      profile_picture: { type: Sequelize.STRING, allowNull: true },

      position: { type: Sequelize.STRING, allowNull: true },
      sex: {
        type: Sequelize.ENUM("Male", "Female"),
        allowNull: true,
      },
      terms: {
        type: Sequelize.ENUM("Part Time", "Contract", "Temporary", "Permanent"),
        allowNull: true,
      },
      estSalary: { type: Sequelize.FLOAT, allowNull: true },
      educationLevel: { type: Sequelize.STRING, allowNull: true },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop table on rollback
    await queryInterface.dropTable("labor_informations");
    // If you need to also remove the ENUM type in Postgres, add that here.
    // await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_labor_informations_status";');
  },
};
