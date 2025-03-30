"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "warehouses",
      [
        {
          id: "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1", // sample warehouse id
          equipment_id: "11111111-1111-1111-1111-111111111111", // from equipments seed
          type: "Storage",
          owner: "John Doe",
          workingStatus: "Operational",
          currentWorkingSite: "Site A",
          approvedBy: "Manager A",
          remark: "All good",
          status: "Active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2", // sample warehouse id
          equipment_id: "22222222-2222-2222-2222-222222222222", // from equipments seed
          type: "Depot",
          owner: "Jane Smith",
          workingStatus: "Non-Operational",
          currentWorkingSite: "Site B",
          approvedBy: null,
          remark: "Needs maintenance",
          status: "Under Maintenance",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("warehouses", null, {});
  },
};
