"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        // Check if the constraint exists before trying to remove it
        // The constraint name observed in the error is "warehouses_siteId_key"
        try {
            await queryInterface.removeConstraint("warehouses", "warehouses_siteId_key");
        } catch (error) {
            console.log("Constraint warehouses_siteId_key not found or already removed.");
        }
    },

    async down(queryInterface, Sequelize) {
        // Optionally add it back if we want to reverse, but usually, we don't want it.
        await queryInterface.addConstraint("warehouses", {
            fields: ["siteId"],
            type: "unique",
            name: "warehouses_siteId_key",
        });
    },
};
