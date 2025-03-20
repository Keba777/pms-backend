module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the 'start_date' column already exists in the 'activities' table
    const hasStartDateColumn = await queryInterface.sequelize.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'activities' AND column_name = 'start_date';"
    );

    // Add 'start_date' column if it doesn't exist
    if (hasStartDateColumn[0].length === 0) {
      await queryInterface.addColumn("activities", "start_date", {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }

    // Check if the 'end_date' column already exists in the 'activities' table
    const hasEndDateColumn = await queryInterface.sequelize.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'activities' AND column_name = 'end_date';"
    );

    // Add 'end_date' column if it doesn't exist
    if (hasEndDateColumn[0].length === 0) {
      await queryInterface.addColumn("activities", "end_date", {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }

    // Check if the 'status' column already exists in the 'activities' table
    const hasStatusColumn = await queryInterface.sequelize.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'activities' AND column_name = 'status';"
    );

    // Add 'status' column if it doesn't exist
    if (hasStatusColumn[0].length === 0) {
      await queryInterface.addColumn("activities", "status", {
        type: Sequelize.ENUM(
          "Not Started",
          "Started",
          "InProgress",
          "Canceled",
          "Onhold",
          "Completed"
        ),
        allowNull: false,
        defaultValue: "Not Started", // Default value to avoid issues
      });
    }

    // Check if the 'approvalStatus' column already exists in the 'activities' table
    const hasApprovalStatusColumn = await queryInterface.sequelize.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'activities' AND column_name = 'approvalStatus';"
    );

    // Add 'approvalStatus' column if it doesn't exist
    if (hasApprovalStatusColumn[0].length === 0) {
      await queryInterface.addColumn("activities", "approvalStatus", {
        type: Sequelize.ENUM("Approved", "Not Approved", "Pending"),
        allowNull: false,
        defaultValue: "Pending", // Default value to avoid issues
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the newly added columns in the 'down' method
    await queryInterface.removeColumn("activities", "start_date");
    await queryInterface.removeColumn("activities", "end_date");
    await queryInterface.removeColumn("activities", "status");
    await queryInterface.removeColumn("activities", "approvalStatus");
  },
};
