"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const departments = [
      {
        id: Sequelize.literal("uuid_generate_v4()"),
        name: "Administrative",
        description: "Department for administrative tasks",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.literal("uuid_generate_v4()"),
        name: "Engineering",
        description: "Department for engineering projects",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.literal("uuid_generate_v4()"),
        name: "Coordination",
        description: "Department for coordination tasks",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.literal("uuid_generate_v4()"),
        name: "HR",
        description: "Human Resources department",
        status: "Active",
        // Sub-departments for HR as a JSON array
        subDepartment: JSON.stringify([
          {
            name: "Recruitment Office",
            description: "Handles recruitment activities",
          },
          { name: "Payroll Office", description: "Handles payroll processing" },
          {
            name: "Training",
            description: "Oversees employee training and development",
          },
        ]),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.literal("uuid_generate_v4()"),
        name: "Finance & Accounting",
        description: "Handles financial planning and accounting",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.literal("uuid_generate_v4()"),
        name: "Procurement & Logistics",
        description: "Manages procurement and logistics operations",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.literal("uuid_generate_v4()"),
        name: "Plant & Equipments",
        description: "Oversees plant operations and equipment management",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.literal("uuid_generate_v4()"),
        name: "Sales & Marketing",
        description: "Focuses on sales strategies and marketing campaigns",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.literal("uuid_generate_v4()"),
        name: "IT",
        description: "Information Technology department",
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("departments", departments, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("departments", null, {});
  },
};
