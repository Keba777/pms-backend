"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "activities",
      [
        {
          id: uuidv4(),
          activity_name: "Activity 1",
          task_id: "e7a21b2d-3c1f-42b5-940b-d402098d35c3", // Task ID from Smart Irrigation System (Design the homepage)
          priority: "Medium",
          unit: "Hours",
          start_date: new Date("2025-03-01T00:00:00.000Z"),
          end_date: new Date("2025-03-10T00:00:00.000Z"),
          progress: 70,
          status: "InProgress",
          approvalStatus: "Pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          activity_name: "Activity 2 for Task 2",
          task_id: "a32ab377-dfbd-47f7-bf85-9fdfb60f8f56", // Task ID from Online Pharmacy App (Set up database)
          priority: "High",
          unit: "Hours",
          start_date: new Date("2025-03-02T00:00:00.000Z"),
          end_date: new Date("2025-03-12T00:00:00.000Z"),
          progress: 50,
          status: "Started",
          approvalStatus: "Pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          activity_name: "API Integration for Task 3",
          task_id: "d5a0843a-5e23-46cc-900f-bb411f5e4a3a", // Task ID from E-commerce Platform (API Integration)
          priority: "Critical",
          unit: "Hours",
          start_date: new Date("2025-03-20T00:00:00.000Z"),
          end_date: new Date("2025-04-01T00:00:00.000Z"),
          progress: 0,
          status: "Not Started",
          approvalStatus: "Pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          activity_name: "Deploy to Production for Task 4",
          task_id: "a32ab377-dfbd-47f7-bf85-9fdfb60f8f56", // Task ID from Online Pharmacy App (Deploy to Production)
          priority: "High",
          unit: "Hours",
          start_date: new Date("2025-03-21T00:00:00.000Z"),
          end_date: new Date("2025-04-10T00:00:00.000Z"),
          progress: 0,
          status: "Not Started",
          approvalStatus: "Pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          activity_name: "Authentication System Implementation",
          task_id: "e7a21b2d-3c1f-42b5-940b-d402098d35c3", // Task ID from Smart Irrigation System (Implement authentication system)
          priority: "High",
          unit: "Hours",
          start_date: new Date("2025-03-21T00:00:00.000Z"),
          end_date: new Date("2025-04-05T00:00:00.000Z"),
          progress: 10,
          status: "Not Started",
          approvalStatus: "Not Approved",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          activity_name: "Database Setup",
          task_id: "d5a0843a-5e23-46cc-900f-bb411f5e4a3a", // Task ID from E-commerce Platform (Set up database)
          priority: "Medium",
          unit: "Hours",
          start_date: new Date("2025-03-23T00:00:00.000Z"),
          end_date: new Date("2025-03-30T00:00:00.000Z"),
          progress: 20,
          status: "InProgress",
          approvalStatus: "Pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          activity_name: "Testing API Integrations",
          task_id: "d5a0843a-5e23-46cc-900f-bb411f5e4a3a", // Task ID from E-commerce Platform (API Integration)
          priority: "High",
          unit: "Hours",
          start_date: new Date("2025-03-25T00:00:00.000Z"),
          end_date: new Date("2025-04-10T00:00:00.000Z"),
          progress: 0,
          status: "Not Started",
          approvalStatus: "Pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          activity_name: "Code Review for Task 4",
          task_id: "a32ab377-dfbd-47f7-bf85-9fdfb60f8f56", // Task ID from Online Pharmacy App (Deploy to Production)
          priority: "Critical",
          unit: "Hours",
          start_date: new Date("2025-04-01T00:00:00.000Z"),
          end_date: new Date("2025-04-10T00:00:00.000Z"),
          progress: 0,
          status: "Not Started",
          approvalStatus: "Pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          activity_name: "Final Testing for Task 2",
          task_id: "e7a21b2d-3c1f-42b5-940b-d402098d35c3", // Task ID from Smart Irrigation System (Design the homepage)
          priority: "Medium",
          unit: "Hours",
          start_date: new Date("2025-04-10T00:00:00.000Z"),
          end_date: new Date("2025-04-20T00:00:00.000Z"),
          progress: 0,
          status: "Not Started",
          approvalStatus: "Pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Additional activities
        {
          id: uuidv4(),
          activity_name: "UI Design for Social Media App",
          task_id: "de0ab557-7e91-45ad-bd67-4c8fd0e6f222", // Task ID from Social Media App (Design login page)
          priority: "High",
          unit: "Hours",
          start_date: new Date("2025-04-01T00:00:00.000Z"),
          end_date: new Date("2025-04-15T00:00:00.000Z"),
          progress: 0,
          status: "Not Started",
          approvalStatus: "Pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          activity_name: "Database Configuration for Digital Banking App",
          task_id: "d5a0843a-5e23-46cc-900f-bb411f5e4a3a", // Task ID from Digital Banking App (Set up database)
          priority: "Critical",
          unit: "Hours",
          start_date: new Date("2025-04-05T00:00:00.000Z"),
          end_date: new Date("2025-04-15T00:00:00.000Z"),
          progress: 0,
          status: "Not Started",
          approvalStatus: "Pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("activities", null, {});
  },
};
