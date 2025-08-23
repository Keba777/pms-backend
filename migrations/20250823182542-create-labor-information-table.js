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
    await queryInterface.dropTable("labor_informations");
  },
};
