"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "projects",
      [
        {
          id: "d450d73b-fc85-44d9-aeb1-38952a1a4e0e", // Hardcoded UUID for Smart Irrigation System
          title: "Smart Irrigation System",
          description:
            "A system to optimize water usage in agriculture using sensor technology and machine learning.",
          priority: "High",
          start_date: new Date("2025-04-01"),
          end_date: new Date("2025-10-01"),
          budget: 50000.0,
          client: "Agritech Ltd.",
          site: "Ethiopia",
          progress: 10,
          isFavourite: false,
          status: "InProgress",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "b093cd82-5153-4a88-9f98-3f4b45c6a2ab", // Hardcoded UUID for Online Pharmacy App
          title: "Online Pharmacy App",
          description:
            "A mobile app for ordering medications online and delivering them to your doorstep.",
          priority: "Critical",
          start_date: new Date("2025-05-01"),
          end_date: new Date("2025-12-01"),
          budget: 75000.0,
          client: "MedCorp",
          site: "USA",
          progress: 25,
          isFavourite: true,
          status: "Started",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "f5a84ea9-6f47-4e5a-8d77-c5cb1b1a07f2", // Hardcoded UUID for E-commerce Platform
          title: "E-commerce Platform",
          description:
            "An e-commerce platform for selling consumer goods online.",
          priority: "Medium",
          start_date: new Date("2025-06-01"),
          end_date: new Date("2025-11-01"),
          budget: 20000.0,
          client: "RetailX",
          site: "UK",
          progress: 5,
          isFavourite: false,
          status: "Not Started",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "7df31e88-4c6b-4b3e-8853-1b6b42bb1e26", // Hardcoded UUID for Task Management System
          title: "Task Management System",
          description:
            "A web app for managing and tracking tasks and projects within teams.",
          priority: "Low",
          start_date: new Date("2025-07-01"),
          end_date: new Date("2025-10-15"),
          budget: 10000.0,
          client: "TeamWorks",
          site: "Canada",
          progress: 50,
          isFavourite: true,
          status: "InProgress",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "7baf0c5c-0c3b-47d4-90b0-e197b92f0fa3", // Hardcoded UUID for Social Media App
          title: "Social Media App",
          description:
            "A platform for users to interact, share content, and build communities.",
          priority: "Medium",
          start_date: new Date("2025-08-01"),
          end_date: new Date("2025-11-30"),
          budget: 50000.0,
          client: "SocialTech",
          site: "Global",
          progress: 0,
          isFavourite: false,
          status: "Not Started",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "a15b6187-c042-44c8-b728-7056e74d9b83", // Hardcoded UUID for Digital Banking App
          title: "Digital Banking App",
          description:
            "A mobile banking application for secure transactions and money management.",
          priority: "Critical",
          start_date: new Date("2025-09-01"),
          end_date: new Date("2025-12-01"),
          budget: 100000.0,
          client: "FinCorp",
          site: "USA",
          progress: 0,
          isFavourite: true,
          status: "Not Started",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("projects", null, {});
  },
};
