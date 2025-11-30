"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add username column initially as nullable
    await queryInterface.addColumn("users", "username", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    });

    // Fetch all users
    const users = await queryInterface.sequelize.query(
      "SELECT id, first_name, last_name FROM users",
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Generate unique usernames for existing users
    for (const user of users) {
      let base = `${user.first_name.toLowerCase()}.${user.last_name.toLowerCase()}`;
      let username = base;
      let count = 1;

      while (true) {
        const existing = await queryInterface.sequelize.query(
          "SELECT id FROM users WHERE username = :username",
          {
            replacements: { username },
            type: Sequelize.QueryTypes.SELECT,
          }
        );

        if (existing.length === 0) break;

        username = `${base}${count}`;
        count++;
      }

      await queryInterface.sequelize.query(
        "UPDATE users SET username = :username WHERE id = :id",
        {
          replacements: { username, id: user.id },
        }
      );
    }

    // Change username to non-nullable and unique
    await queryInterface.changeColumn("users", "username", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });

    // Add gender
    await queryInterface.addColumn("users", "gender", {
      type: Sequelize.ENUM("Male", "Female"),
      allowNull: false,
      defaultValue: "Male",
    });

    // Add position
    await queryInterface.addColumn("users", "position", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Add terms
    await queryInterface.addColumn("users", "terms", {
      type: Sequelize.ENUM("Part Time", "Contract", "Temporary", "Permanent"),
      allowNull: true,
    });

    // Add joiningDate
    await queryInterface.addColumn("users", "joiningDate", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    // Add estSalary
    await queryInterface.addColumn("users", "estSalary", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });

    // Add ot
    await queryInterface.addColumn("users", "ot", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "ot");
    await queryInterface.removeColumn("users", "estSalary");
    await queryInterface.removeColumn("users", "joiningDate");
    await queryInterface.removeColumn("users", "terms");
    await queryInterface.removeColumn("users", "position");
    await queryInterface.removeColumn("users", "gender");
    await queryInterface.removeColumn("users", "username");
  },
};