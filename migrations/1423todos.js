'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(
            'ALTER TABLE "todos" ALTER COLUMN "target" TYPE VARCHAR(255)[] USING ARRAY["target"::text]::VARCHAR(255)[];'
        );
    },

    down: async (queryInterface, Sequelize) => {
        // Attempt to revert back to string, joining array elements with comma if possible, or just casting to text.
        // This is a best-effort revert.
        await queryInterface.sequelize.query(
            'ALTER TABLE "todos" ALTER COLUMN "target" TYPE VARCHAR(255) USING array_to_string("target", \',\');'
        );
    }
};
