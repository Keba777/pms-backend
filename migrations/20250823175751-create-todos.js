'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('todos', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      task: { type: Sequelize.STRING, allowNull: false },
      type: { type: Sequelize.STRING, allowNull: false },
      priority: { type: Sequelize.ENUM('Urgent','High','Medium','Low'), allowNull: false },
      assignedById: { type: Sequelize.UUID, allowNull: false },
      givenDate: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      dueDate: { type: Sequelize.DATE, allowNull: false },
      target: { type: Sequelize.DATE, allowNull: false },
      kpiId: { type: Sequelize.UUID },
      departmentId: { type: Sequelize.UUID, allowNull: false },
      status: { type: Sequelize.ENUM('Not Started','In progress','Pending','Completed'), defaultValue: 'Not Started' },
      progress: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      remark: { type: Sequelize.TEXT },
      remainder: { type: Sequelize.STRING },
      attachment: { type: Sequelize.ARRAY(Sequelize.STRING) },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('todos');
  }
};

