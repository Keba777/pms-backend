"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * NOTE:
     *  - Ensure that the referenced User, Department, Activity, Project, and Task rows already exist 
     *    (i.e. these UUIDs must match actual rows in those tables).
     */

    // Provided IDs:
    const user1Id = "39401580-80e1-4252-9c4f-72706c4ca7ba";
    const user2Id = "8bf7f003-e664-4d8a-85c5-d7ec17a2d11b";

    const dept1Id = "bad2f3be-afba-42ec-ba72-2282c43e3657";
    const dept2Id = "c9df4837-c4ae-47c4-ac7b-91d0430d45b8";

    const project1Id = "9e62d974-8391-4fc3-9887-d2bd21c22330";
    // (we only need one project for these seeds; adjust/add more if needed)

    const task1Id = "643098f2-2bc7-46d3-94a9-3305900767ac";
    // (we only need one task for these seeds; adjust/add more if needed)

    const activity1Id = "28d9ec0b-58c7-487e-a79e-28bb8433d3a1";
    // (we only need one activity for these seeds; adjust/add more if needed)

    // Use one of the existing users as "responsible"
    const responsible1Id = user2Id;

    // Insert three example "issues":
    await queryInterface.bulkInsert(
      "issues",
      [
        {
          id: uuidv4(),
          date: new Date("2025-05-01"),
          issueType: "UI Bug",
          description: "Dropdown overlap on mobile view",
          raisedById: user1Id,
          priority: "Medium",
          siteId: null,              // optional; no site specified
          departmentId: dept1Id,
          responsibleId: responsible1Id,
          actionTaken: "Assigned to front-end team",
          status: "Open",
          activityId: activity1Id,
          projectId: null,
          taskId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          date: new Date("2025-05-03"),
          issueType: "Data Sync Error",
          description: "Tasks not syncing to back-end API",
          raisedById: user2Id,
          priority: "Urgent",
          siteId: null,
          departmentId: dept2Id,
          responsibleId: responsible1Id,
          actionTaken: "Investigating DB connectivity",
          status: "In Progress",
          activityId: null,
          projectId: project1Id,
          taskId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          date: new Date("2025-05-05"),
          issueType: "Permissions",
          description: "User cannot delete own tasks",
          raisedById: user1Id,
          priority: "Low",
          siteId: null,
          departmentId: dept1Id,
          responsibleId: responsible1Id,
          actionTaken: "Adjusted role in RBAC settings",
          status: "Resolved",
          activityId: null,
          projectId: null,
          taskId: task1Id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    // Remove all rows from "issues" table. Modify WHERE if you only want to delete these three.
    await queryInterface.bulkDelete("issues", null, {});
  },
};
