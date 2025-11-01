"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("todos", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      task: { type: Sequelize.STRING, allowNull: false },
      type: { type: Sequelize.STRING, allowNull: false },
      priority: {
        type: Sequelize.ENUM("Urgent", "High", "Medium", "Low"),
        allowNull: false,
      },

      assignedById: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      givenDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },

      dueDate: { type: Sequelize.DATE, allowNull: false },

      target: { type: Sequelize.DATE, allowNull: false },

      kpiId: { type: Sequelize.UUID, allowNull: true },

      departmentId: { type: Sequelize.UUID, allowNull: false },

      status: {
        type: Sequelize.ENUM("Not Started", "In progress", "Pending", "Completed"),
        allowNull: false,
        defaultValue: "Not Started",
      },

      progress: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },

      remark: { type: Sequelize.TEXT, allowNull: true },

      remainder: { type: Sequelize.STRING, allowNull: true },

      attachment: { type: Sequelize.ARRAY(Sequelize.STRING), allowNull: true },

      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });

    // add FK constraints (explicitly)
    await queryInterface.addConstraint("todos", {
      fields: ["assignedById"],
      type: "foreign key",
      name: "fk_todos_assignedById_users_id",
      references: { table: "users", field: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    });

    await queryInterface.addConstraint("todos", {
      fields: ["departmentId"],
      type: "foreign key",
      name: "fk_todos_departmentId_departments_id",
      references: { table: "departments", field: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    });

    // kpiId optional FK if KPI table exists
    await queryInterface.addConstraint("todos", {
      fields: ["kpiId"],
      type: "foreign key",
      name: "fk_todos_kpiId_kpis_id",
      references: { table: "kpis", field: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    // indexes for common queries
    await queryInterface.addIndex("todos", ["departmentId"]);
    await queryInterface.addIndex("todos", ["status"]);
  },

  async down(queryInterface, Sequelize) {
    // remove indexes and constraints first
    await queryInterface.removeIndex("todos", ["status"]);
    await queryInterface.removeIndex("todos", ["departmentId"]);

    await queryInterface.removeConstraint("todos", "fk_todos_kpiId_kpis_id").catch(() => {});
    await queryInterface.removeConstraint("todos", "fk_todos_departmentId_departments_id").catch(() => {});
    await queryInterface.removeConstraint("todos", "fk_todos_assignedById_users_id").catch(() => {});

    await queryInterface.dropTable("todos");

    // drop enum types created for the table
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_todos_priority";
      DROP TYPE IF EXISTS "enum_todos_status";
    `);
  },
};

