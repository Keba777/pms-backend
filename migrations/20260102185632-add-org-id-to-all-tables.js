'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = [
      'users',
      'roles',
      'departments',
      'sites',
      'projects',
      'tasks',
      'activities',
      'warehouses',
      'materials',
      'equipments',
      'labors',
      'kpis',
      'tags',
      'todos',
      'requests',
      'approvals',
      'dispatches',
      'request_deliveries',
      'store_requisitions',
      'master_schedule',
      'todo_progress',
      'notifications',
      'labor_timesheets',
      'equipment_timesheets',
      'material_balance_sheets',
      'labor_informations',
      'workflow_logs',
      'files',
      'budgets',
      'invoices',
      'payments',
      'payrolls',
      'issues',
      'chat_rooms',
      'chat_messages',
      'collab_discussions',
      'collab_notifications',
      'collab_activity_logs',
      'clients'
    ];

    for (const table of tables) {
      try {
        await queryInterface.addColumn(table, 'orgId', {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'organizations',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        });
      } catch (err) {
        console.warn(`Could not add orgId to table ${table}:`, err.message);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    const tables = [
      'users',
      'roles',
      'departments',
      'sites',
      'projects',
      'tasks',
      'activities',
      'warehouses',
      'materials',
      'equipments',
      'labors',
      'kpis',
      'tags',
      'todos',
      'requests',
      'approvals',
      'dispatches',
      'request_deliveries',
      'store_requisitions',
      'master_schedule',
      'todo_progress',
      'notifications',
      'labor_timesheets',
      'equipment_timesheets',
      'material_balance_sheets',
      'labor_informations',
      'workflow_logs',
      'files',
      'budgets',
      'invoices',
      'payments',
      'payrolls',
      'issues',
      'chat_rooms',
      'chat_messages',
      'collab_discussions',
      'collab_notifications',
      'collab_activity_logs',
      'clients'
    ];

    for (const table of tables) {
      try {
        await queryInterface.removeColumn(table, 'orgId');
      } catch (err) {
        console.warn(`Could not remove orgId from table ${table}:`, err.message);
      }
    }
  }
};
