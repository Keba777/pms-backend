"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // discussions
    await queryInterface.createTable("collab_discussions", {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      date: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal("NOW()") },
      type: { allowNull: false, type: Sequelize.ENUM("project", "task", "activity", "todo") },
      referenceId: { allowNull: false, type: Sequelize.UUID },
      subject: { allowNull: false, type: Sequelize.STRING },
      body: { allowNull: false, type: Sequelize.TEXT },
      createdBy: {
        allowNull: false,
        type: Sequelize.UUID,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      isPrivate: { allowNull: false, type: Sequelize.BOOLEAN, defaultValue: false },
      participants: { allowNull: true, type: Sequelize.JSONB },
      lastMessageAt: { allowNull: true, type: Sequelize.DATE },
      pinned: { allowNull: false, type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal("NOW()") },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal("NOW()") },
    });

    // notifications
    await queryInterface.createTable("collab_notifications", {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      date: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal("NOW()") },
      type: { allowNull: false, type: Sequelize.ENUM("project", "task", "activity", "todo") },
      referenceId: { allowNull: false, type: Sequelize.UUID },
      title: { allowNull: true, type: Sequelize.STRING },
      message: { allowNull: false, type: Sequelize.TEXT },
      recipient: {
        allowNull: false,
        type: Sequelize.UUID,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      sender: {
        allowNull: true,
        type: Sequelize.UUID,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      read: { allowNull: false, type: Sequelize.BOOLEAN, defaultValue: false },
      meta: { allowNull: true, type: Sequelize.JSONB },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal("NOW()") },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal("NOW()") },
    });

    // activity_logs
    await queryInterface.createTable("collab_activity_logs", {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      date: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal("NOW()") },
      type: { allowNull: false, type: Sequelize.ENUM("project", "task", "activity", "todo") },
      referenceId: { allowNull: false, type: Sequelize.UUID },
      action: { allowNull: false, type: Sequelize.STRING },
      actor: {
        allowNull: true,
        type: Sequelize.UUID,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      details: { allowNull: true, type: Sequelize.JSONB },
      parentActivityId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: { model: "collab_activity_logs", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal("NOW()") },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal("NOW()") },
    });

    // Add simple indices for faster lookups
    await queryInterface.addIndex("collab_discussions", ["type", "referenceId"]);
    await queryInterface.addIndex("collab_notifications", ["type", "referenceId"]);
    await queryInterface.addIndex("collab_activity_logs", ["type", "referenceId"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("collab_activity_logs");
    await queryInterface.dropTable("collab_notifications");
    await queryInterface.dropTable("collab_discussions");

    // remove enum types
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_activity_logs_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_notifications_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_discussions_type";');
  },
};
