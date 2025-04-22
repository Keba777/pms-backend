"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("warehouses", [
      {
        id: "b10a1f1e-7e9c-4b45-b6f0-2ac9bdbabc01",
        type: "Storage",
        owner: "ABC Construction Co.",
        workingStatus: "Operational",
        currentWorkingSite: "Addis Ababa",
        approvedBy: "John Doe",
        remark: "Well maintained",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "a20b2f2d-8c1d-4e3a-8b67-3bc7fdcecd02",
        type: "Maintenance",
        owner: "XYZ Builders",
        workingStatus: "Non-Operational",
        currentWorkingSite: "Bahir Dar",
        approvedBy: null,
        remark: "Under renovation",
        status: "Under Maintenance",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "c30c3f3c-9d2e-4c89-95e2-4dd8eefdef03",
        type: "Tools",
        owner: "MNO Group",
        workingStatus: "Operational",
        currentWorkingSite: "Hawassa",
        approvedBy: "Sarah Smith",
        remark: null,
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("warehouses", null, {});
  },
};
