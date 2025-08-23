"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("master_schedule", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      schedule_type: {
        type: Sequelize.ENUM("Project", "Task", "Activity"),
        allowNull: false,
      },
      reference_id: { type: Sequelize.UUID, allowNull: false },
      start_date: { type: Sequelize.DATE, allowNull: false },
      end_date: { type: Sequelize.DATE, allowNull: false },
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
  async down(queryInterface) {
    await queryInterface.dropTable("master_schedule");
  },
};
