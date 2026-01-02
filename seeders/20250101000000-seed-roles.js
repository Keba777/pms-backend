'use strict';

const rolesData = require('../src/seeders/data/roles.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        if (!rolesData || !Array.isArray(rolesData)) {
            console.error('Roles data not found or not an array');
            return;
        }
        // Upsert roles with specific IDs and permissions
        for (const role of rolesData) {
            await queryInterface.bulkInsert('roles', [{
                id: role.id,
                name: role.name,
                permissions: role.permissions ? JSON.stringify(role.permissions) : null,
                createdAt: new Date(role.createdAt || Date.now()),
                updatedAt: new Date(role.updatedAt || Date.now())
            }], {
                updateOnDuplicate: ['name', 'permissions', 'updatedAt']
            });
        }
    },

    async down(queryInterface, Sequelize) {
        if (!rolesData || !Array.isArray(rolesData)) return;
        // Remove all seeded roles
        const roleIds = rolesData.map(r => r.id);
        await queryInterface.bulkDelete('roles', {
            id: roleIds
        }, {});
    }
};
