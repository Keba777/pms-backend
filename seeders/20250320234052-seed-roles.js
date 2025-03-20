"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "roles",
      [
        {
          id: "550e8400-e29b-41d4-a716-446655440000",
          name: "Admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "a3d1c6b5-7e4c-44e8-a2b1-5c6d3a4e8f7b",
          name: "User",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("roles", null, {});
  },
};
