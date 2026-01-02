'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // 1. siteId
        await queryInterface.changeColumn('users', 'siteId', {
            type: Sequelize.UUID,
            allowNull: true,
        });

        // 2. phone
        await queryInterface.changeColumn('users', 'phone', {
            type: Sequelize.STRING(20),
            allowNull: true,
        });

        // 3. gender
        await queryInterface.changeColumn('users', 'gender', {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: 'Male'
        });

        // 4. department_id
        await queryInterface.changeColumn('users', 'department_id', {
            type: Sequelize.UUID,
            allowNull: true,
        });
    },

    down: async (queryInterface, Sequelize) => {
        // We don't necessarily want to revert to NOT NULL if they were intended to be optional
    },
};
