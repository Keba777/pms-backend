"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "equipments",
      [
        {
          id: "c1a1f97a-0f62-4f68-9d3e-1a04ffb10001",
          item: "Concrete Mixer",
          unit: "piece",
          manufacturer: "Caterpillar",
          year: "2020",
          minQuantity: 2,
          estimatedHours: 5.5,
          rate: 120.75,
          totalAmount: 241.5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "d2b2f97b-0a73-4b68-9c2f-2b15aab20002",
          item: "Excavator",
          unit: "hour",
          manufacturer: "Komatsu",
          year: "2019",
          minQuantity: 10,
          estimatedHours: 8,
          rate: 150.0,
          totalAmount: 1200.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "e3c3f97c-0b84-4c78-9e3d-3c26bbc30003",
          item: "Drill Machine",
          unit: "piece",
          manufacturer: "Bosch",
          year: "2022",
          minQuantity: 5,
          estimatedHours: 2,
          rate: 50.0,
          totalAmount: 100.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "f4d4f97d-0c95-4d88-9f4e-4d37ccc40004",
          item: "Safety Helmet",
          unit: "piece",
          manufacturer: "3M",
          year: "2023",
          minQuantity: 20,
          estimatedHours: null,
          rate: 10.5,
          totalAmount: 210.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "a5e5f97e-0da6-4e98-9f5f-5e48ddd50005",
          item: "Welding Kit",
          unit: "set",
          manufacturer: "Lincoln Electric",
          year: "2021",
          minQuantity: 3,
          estimatedHours: 4,
          rate: 80.0,
          totalAmount: 320.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("equipments", null, {});
  },
};
