"use strict";
const bcrypt = require("bcryptjs"); // Change to bcryptjs

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          id: "123e4567-e89b-12d3-a456-426614174000",
          first_name: "John",
          last_name: "Doe",
          phone: "+123456789",
          role_id: "550e8400-e29b-41d4-a716-446655440000", // Admin role
          email: "john.doe@example.com",
          password: await bcrypt.hash("password123", 10), // Use bcryptjs
          profile_picture: null,
          country_code: "US",
          country: "United States",
          state: "California",
          city: "Los Angeles",
          zip: "90001",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "f8c6a87b-e6f4-4a3b-a2b9-7e3d9a5b6c2d",
          first_name: "Jane",
          last_name: "Smith",
          phone: "+987654321",
          role_id: "a3d1c6b5-7e4c-44e8-a2b1-5c6d3a4e8f7b", // User role
          email: "jane.smith@example.com",
          password: await bcrypt.hash("securepass", 10), // Use bcryptjs
          profile_picture: null,
          country_code: "UK",
          country: "United Kingdom",
          state: "London",
          city: "London",
          zip: "E1 6AN",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
