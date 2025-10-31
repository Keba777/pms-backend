"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // create issues table
    await queryInterface.createTable("issues", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      issueType: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      raisedById: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      priority: {
        type: Sequelize.ENUM("Urgent", "Medium", "Low"),
        allowNull: true,
        defaultValue: "Medium",
      },

      siteId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "sites", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      departmentId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "departments", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      responsibleId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      actionTaken: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM("Open", "In Progress", "Resolved", "Closed"),
        allowNull: false,
        defaultValue: "Open",
      },

      activityId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "activities", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      projectId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "projects", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      taskId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "tasks", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    // Optional: add an index to help queries filtering by status/date
    await queryInterface.addIndex("issues", ["status"]);
    await queryInterface.addIndex("issues", ["date"]);
  },

  async down(queryInterface, Sequelize) {
    // remove indexes first
    await queryInterface.removeIndex("issues", ["status"]);
    await queryInterface.removeIndex("issues", ["date"]);

    // drop table
    await queryInterface.dropTable("issues");

    // drop enum types that Sequelize created
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_issues_priority";
    `);

    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_issues_status";
    `);
  },
};
