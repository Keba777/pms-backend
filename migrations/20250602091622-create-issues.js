"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("issues", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
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
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      priority: {
        type: Sequelize.ENUM("Urgent", "Medium", "Low"),
        allowNull: true,
        defaultValue: "Medium",
      },
      siteId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "sites",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      departmentId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "departments",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      responsibleId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
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
      // Optional associations: only one of activityId, projectId, taskId can be non-null
      activityId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "activities",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      projectId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "projects",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      taskId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "tasks",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Add a CHECK constraint to enforce “only one of (activityId, projectId, taskId) at a time”
    // (PostgreSQL syntax)
    await queryInterface.sequelize.query(`
      ALTER TABLE "issues"
      ADD CONSTRAINT "issues_single_association_chk"
      CHECK (
        ((CASE WHEN "activityId" IS NOT NULL THEN 1 ELSE 0 END)
        + (CASE WHEN "projectId"  IS NOT NULL THEN 1 ELSE 0 END)
        + (CASE WHEN "taskId"     IS NOT NULL THEN 1 ELSE 0 END)
        ) <= 1
      );
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Drop the CHECK constraint first (so that PostgreSQL doesn’t complain)
    await queryInterface.sequelize.query(`
      ALTER TABLE "issues"
      DROP CONSTRAINT IF EXISTS "issues_single_association_chk";
    `);

    // Then drop the table (this will also drop any ENUM types automatically)
    await queryInterface.dropTable("issues");
  },
};
