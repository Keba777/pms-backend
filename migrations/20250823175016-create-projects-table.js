"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("projects", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      title: { type: Sequelize.STRING(100), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      priority: {
        type: Sequelize.ENUM("Critical", "High", "Medium", "Low"),
        allowNull: false,
      },
      start_date: { type: Sequelize.DATE, allowNull: false },
      end_date: { type: Sequelize.DATE, allowNull: false },
      budget: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      client: { type: Sequelize.STRING(100), allowNull: false },
      site: { type: Sequelize.STRING(100), allowNull: false },
      site_id: { type: Sequelize.UUID, allowNull: true },
      progress: { type: Sequelize.INTEGER, defaultValue: 0 },
      isFavourite: { type: Sequelize.BOOLEAN, defaultValue: false },
      status: {
        type: Sequelize.ENUM(
          "Not Started",
          "Started",
          "InProgress",
          "Canceled",
          "Onhold",
          "Completed"
        ),
        allowNull: false,
      },
      tagIds: { type: Sequelize.ARRAY(Sequelize.UUID), allowNull: true },
      actuals: { type: Sequelize.JSONB, defaultValue: {}, allowNull: false },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("projects");
  },
};
