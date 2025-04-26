"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1) remove old address fields
    await Promise.all([
      queryInterface.removeColumn("users", "country_code"),
      queryInterface.removeColumn("users", "country"),
      queryInterface.removeColumn("users", "state"),
      queryInterface.removeColumn("users", "city"),
      queryInterface.removeColumn("users", "zip"),
    ]);

    // 2) add new department_id & status
    await queryInterface.addColumn("users", "department_id", {
      type: Sequelize.UUID,
      allowNull: true,
      defaultValue: null,
      references: {
        model: "departments",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
    await queryInterface.addColumn("users", "status", {
      type: Sequelize.ENUM("Active", "InActive"),
      allowNull: true,
      defaultValue: "Active",
    });

    // 3) create project_members pivot
    await queryInterface.createTable("project_members", {
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      project_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "projects", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });

    // 4) create task_members pivot
    await queryInterface.createTable("task_members", {
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      task_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "tasks", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });

    // 5) create activity_members pivot
    await queryInterface.createTable("activity_members", {
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      activity_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "activities", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // reverse: drop pivots, drop new cols, re-add old address cols
    await Promise.all([
      queryInterface.dropTable("activity_members"),
      queryInterface.dropTable("task_members"),
      queryInterface.dropTable("project_members"),
    ]);

    await queryInterface.removeColumn("users", "status");
    await queryInterface.removeColumn("users", "department_id");

    // re-create old address fields
    await Promise.all([
      queryInterface.addColumn("users", "country_code", {
        type: Sequelize.STRING(10),
        allowNull: false,
      }),
      queryInterface.addColumn("users", "country", {
        type: Sequelize.STRING(100),
        allowNull: false,
      }),
      queryInterface.addColumn("users", "state", {
        type: Sequelize.STRING(100),
        allowNull: false,
      }),
      queryInterface.addColumn("users", "city", {
        type: Sequelize.STRING(100),
        allowNull: false,
      }),
      queryInterface.addColumn("users", "zip", {
        type: Sequelize.STRING(20),
        allowNull: false,
      }),
    ]);

    // drop the ENUM type (Postgres)
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_users_status";'
    );
  },
};
