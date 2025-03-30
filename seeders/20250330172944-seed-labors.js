"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "labors",
      [
        {
          id: "55555555-5555-5555-5555-555555555555",
          total_labor: 10,
          hourly_rate: 25.0,
          skill_level: "Intermediate",
          // Associated with fourth activity (Code Review for Task 4)
          activity_id: "5a5f451f-31ad-457f-97ff-3c8742741a75",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "66666666-6666-6666-6666-666666666666",
          total_labor: 20,
          hourly_rate: 30.0,
          skill_level: "Expert",
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
    await queryInterface.bulkDelete("labors", null, {});
  },
};
