"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("materials", [
      {
        id: "a1d2c3b4-1111-4aaa-aaaa-000000000001",
        warehouseId: "b10a1f1e-7e9c-4b45-b6f0-2ac9bdbabc01", // Storage
        item: "Cement",
        unit: "bag",
        minQuantity: 100,
        rate: 7.5,
        totalAmount: 750.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "b2e3d4c5-2222-4bbb-bbbb-000000000002",
        warehouseId: "a20b2f2d-8c1d-4e3a-8b67-3bc7fdcecd02", // Maintenance
        item: "Steel Rod",
        unit: "kg",
        minQuantity: 500,
        rate: 2.3,
        totalAmount: 1150.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "c3f4e5d6-3333-4ccc-cccc-000000000003",
        warehouseId: "c30c3f3c-9d2e-4c89-95e2-4dd8eefdef03", // Tools
        item: "Paint",
        unit: "gallon",
        minQuantity: 50,
        rate: 12.0,
        totalAmount: 600.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("materials", null, {});
  },
};
