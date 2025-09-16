"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Budgets
    await queryInterface.createTable("budgets", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      project_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "projects", key: "id" },
        onDelete: "CASCADE",
      },
      total_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      spent_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
      },
      remaining_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // Invoices
    await queryInterface.createTable("invoices", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      project_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "projects", key: "id" },
        onDelete: "CASCADE",
      },
      invoice_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("Pending", "Paid", "Overdue"),
        defaultValue: "Pending",
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // Payments
    await queryInterface.createTable("payments", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      invoice_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "invoices", key: "id" },
        onDelete: "CASCADE",
      },
      amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      payment_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      method: {
        type: Sequelize.ENUM("Cash", "Bank Transfer", "Check", "Other"),
        defaultValue: "Cash",
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // Payrolls
    await queryInterface.createTable("payrolls", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      salary: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      bonus: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: 0,
      },
      deductions: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: 0,
      },
      net_pay: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      pay_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("payrolls");
    await queryInterface.dropTable("payments");
    await queryInterface.dropTable("invoices");
    await queryInterface.dropTable("budgets");
  },
};
