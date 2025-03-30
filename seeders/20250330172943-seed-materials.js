"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "materials",
      [
        {
          id: "33333333-3333-3333-3333-333333333333",
          quantity: 100,
          warehouse_id: "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1", // matches a warehouse seed
          item: "Steel Beams",
          rate_with_vat: 50.0,
          unit: "Kg",
          // Associated with third activity (API Integration for Task 3)
          activity_id: "03855b22-99f8-4742-aaca-5adce130c2e4",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "44444444-4444-4444-4444-444444444444",
          quantity: 200,
          warehouse_id: "aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2", // matches a warehouse seed
          item: "Concrete Bags",
          rate_with_vat: 5.75,
          unit: "Bags",
          // Associated with fifth activity (Activity 2 for Task 2)
          activity_id: "514c8651-a0c0-4ad0-ad0f-789b0781d0cb",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("materials", null, {});
  },
};
