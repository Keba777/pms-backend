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
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "Unallocated",
      },
      profile_picture: { type: Sequelize.STRING, allowNull: true },
      phone: { type: Sequelize.STRING, allowNull: true },
      position: { type: Sequelize.STRING, allowNull: true },
      sex: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      terms: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      estSalary: { type: Sequelize.FLOAT, allowNull: true },
      educationLevel: { type: Sequelize.STRING, allowNull: true },

      estimatedHours: { type: Sequelize.DECIMAL(8, 2), allowNull: true },
      rate: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      overtimeRate: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      totalAmount: { type: Sequelize.DECIMAL(12, 2), allowNull: true },
      skill_level: { type: Sequelize.STRING, allowNull: true },
      utilization_factor: { type: Sequelize.DECIMAL(8, 2), allowNull: true },
      total_time: { type: Sequelize.DECIMAL(8, 2), allowNull: true },
      shifting_date: { type: Sequelize.DATE, allowNull: true },

      orgId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "organizations", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
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
