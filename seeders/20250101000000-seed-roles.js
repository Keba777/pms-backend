'use strict';

const rolesData = require('../src/seeders/data/roles.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Upsert roles with specific IDs and permissions
        for (const role of rolesData) {
            await queryInterface.bulkInsert('roles', [{
                id: role.id,
                name: role.name,
                permissions: JSON.stringify(role.permissions),
                createdAt: new Date(role.createdAt),
                updatedAt: new Date(role.updatedAt)
            }], {
                updateOnDuplicate: ['name', 'permissions', 'updatedAt']
            });
        }
    },

    async down(queryInterface, Sequelize) {
        // Remove all seeded roles
        const roleIds = rolesData.map(r => r.id);
        await queryInterface.bulkDelete('roles', {
            id: roleIds
        }, {});
    }
};
