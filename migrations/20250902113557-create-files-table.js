"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("files", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      uploadedBy: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      sendTo: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      fileName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      fileUrl: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM("project", "task", "activity", "todo"),
      },
      referenceId: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("files");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_files_type";'
    ); // remove ENUM type
  },
};
