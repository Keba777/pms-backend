"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "labor_informations",
      [
        {
          firstName: "Tefera",
          lastName: "Tadesse",
          laborId: "a5d18d0c-58f0-44cb-ad53-bdf4cbb405e8",
          startsAt: new Date("2025-07-01T08:00:00Z"),
          endsAt: new Date("2025-07-10T17:00:00Z"),
          status: "Allocated",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Mehari",
          lastName: "Abebe",
          laborId: "c985c27e-b065-460b-888a-f695d13c4b73",
          startsAt: new Date("2025-07-05T08:00:00Z"),
          endsAt: new Date("2025-07-12T17:00:00Z"),
          status: "Unallocated",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("labor_informations", null, {});
  },
};
