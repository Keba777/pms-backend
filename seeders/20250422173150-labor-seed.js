"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("labors", [
      {
        id: "f1a1b1c1-d111-4aaa-aaaa-111111111111",
        role: "Mason",
        unit: "person-day",
        minQuantity: 10,
        estimatedHours: 80.0,
        rate: 25.0,
        totalAmount: 2000.0,
        skill_level: "Skilled",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "f2a2b2c2-d222-4bbb-bbbb-222222222222",
        role: "Electrician",
        unit: "person-hour",
        minQuantity: 5,
        estimatedHours: 40.0,
        rate: 30.0,
        totalAmount: 1200.0,
        skill_level: "Semi-Skilled",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "f3a3b3c3-d333-4ccc-cccc-333333333333",
        role: "Laborer",
        unit: "person-day",
        minQuantity: 20,
        estimatedHours: 160.0,
        rate: 15.0,
        totalAmount: 2400.0,
        skill_level: "Unskilled",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("labors", null, {});
  },
};
