"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert tasks with custom long unique task IDs
    await queryInterface.bulkInsert("tasks", [
      {
        id: "e7a21b2d-3c1f-42b5-940b-d402098d35c3", // Custom long task ID
        task_name: "Design the homepage",
        description: "Design the initial homepage layout for the project",
        project_id: "d450d73b-fc85-44d9-aeb1-38952a1a4e0e", // Smart Irrigation System
        priority: "High",
        start_date: new Date(),
        end_date: new Date("2025-04-10"),
        progress: 20,
        status: "InProgress",
        approvalStatus: "Pending",
        assignedTo: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "a32ab377-dfbd-47f7-bf85-9fdfb60f8f56", // Custom long task ID
        task_name: "Set up database",
        description: "Set up PostgreSQL database for the project",
        project_id: "b093cd82-5153-4a88-9f98-3f4b45c6a2ab", // Online Pharmacy App
        priority: "Critical",
        start_date: new Date(),
        end_date: new Date("2025-04-05"),
        progress: 50,
        status: "Started",
        approvalStatus: "Pending",
        assignedTo: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "c94b1fcb-9378-4c50-953f-871cf687fbd1", // Custom long task ID
        task_name: "Implement authentication system",
        description: "Develop and integrate an authentication system for users",
        project_id: "f5a84ea9-6f47-4e5a-8d77-c5cb1b1a07f2", // E-commerce Platform
        priority: "High",
        start_date: new Date(),
        end_date: new Date("2025-04-15"),
        progress: 10,
        status: "Not Started",
        approvalStatus: "Not Approved",
        assignedTo: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "b789fb9d-9ad9-496a-bc76-53012055b2c3", // Custom long task ID
        task_name: "API Integration",
        description: "Integrate third-party APIs for payment and messaging",
        project_id: "d450d73b-fc85-44d9-aeb1-38952a1a4e0e", // Smart Irrigation System
        priority: "Medium",
        start_date: new Date(),
        end_date: new Date("2025-04-20"),
        progress: 0,
        status: "Not Started",
        approvalStatus: "Pending",
        assignedTo: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "f0b28a98-b49e-4c77-a968-f4328f16bdb6", // Custom long task ID
        task_name: "Unit Testing",
        description: "Write unit tests for core modules",
        project_id: "b093cd82-5153-4a88-9f98-3f4b45c6a2ab", // Online Pharmacy App
        priority: "Medium",
        start_date: new Date(),
        end_date: new Date("2025-04-12"),
        progress: 0,
        status: "Not Started",
        approvalStatus: "Pending",
        assignedTo: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "a42f7fa9-c106-41ba-b500-4d2d4c2e986a", // Custom long task ID
        task_name: "Deploy to Production",
        description: "Deploy the application to production environment",
        project_id: "f5a84ea9-6f47-4e5a-8d77-c5cb1b1a07f2", // E-commerce Platform
        priority: "Critical",
        start_date: new Date(),
        end_date: new Date("2025-05-01"),
        progress: 0,
        status: "Not Started",
        approvalStatus: "Pending",
        assignedTo: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "de0ab557-7e91-45ad-bd67-4c8fd0e6f222", // Custom long task ID
        task_name: "Design login page",
        description: "Design the user login page for the application",
        project_id: "7baf0c5c-0c3b-47d4-90b0-e197b92f0fa3", // Social Media App
        priority: "High",
        start_date: new Date(),
        end_date: new Date("2025-08-10"),
        progress: 15,
        status: "InProgress",
        approvalStatus: "Pending",
        assignedTo: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "d5a0843a-5e23-46cc-900f-bb411f5e4a3a", // Custom long task ID
        task_name: "Set up notifications",
        description: "Implement push notifications for user engagement",
        project_id: "a15b6187-c042-44c8-b728-7056e74d9b83", // Digital Banking App
        priority: "Medium",
        start_date: new Date(),
        end_date: new Date("2025-09-15"),
        progress: 0,
        status: "Not Started",
        approvalStatus: "Pending",
        assignedTo: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Insert activities with custom long unique activity IDs
    await queryInterface.bulkInsert("activities", [
      {
        id: "f74b1d69-dac1-46ac-9de0-f9b238b271b9", // Custom long activity ID
        activity_name: "Activity 1",
        task_id: "e7a21b2d-3c1f-42b5-940b-d402098d35c3", // Referencing custom task ID
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
        id: "8f7b9284-1a3d-4f76-bb28-d84ab7b63b1f", // Custom long activity ID
        activity_name: "Activity 2 for Task 1",
        task_id: "e7a21b2d-3c1f-42b5-940b-d402098d35c3", // Referencing custom task ID
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
        id: "b74b0fa6-9931-4b6e-92f1-4de04298e2a2", // Custom long activity ID
        activity_name: "API Integration for Task 3",
        task_id: "b789fb9d-9ad9-496a-bc76-53012055b2c3", // Referencing custom task ID
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
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Remove all tasks and activities added in the up function
    await queryInterface.bulkDelete("tasks", null, {});
    await queryInterface.bulkDelete("activities", null, {});
  },
};
