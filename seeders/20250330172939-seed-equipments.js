"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "equipments",
      [
        {
          id: "11111111-1111-1111-1111-111111111111",
          item: "Excavator",
          rate_with_vat: 150.5,
          reorder_quantity: 2,
          min_quantity: 1,
          manufacturer: "Caterpillar",
          year: 2020,
          eqp_condition: "Operational",
          // Associated with first activity (Testing API Integrations)
          activity_id: "d72b95db-e474-4777-a1ed-8c1eb404ee5a",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "22222222-2222-2222-2222-222222222222",
          item: "Bulldozer",
          rate_with_vat: 200.0,
          reorder_quantity: 1,
          min_quantity: 1,
          manufacturer: "John Deere",
          year: 2018,
          eqp_condition: "Under Maintenance",
          // Associated with second activity (Api INTERGATE)
          activity_id: "484b3cbc-26bf-4676-ad4f-0f2c4e53e132",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("equipments", null, {});
  },
};
