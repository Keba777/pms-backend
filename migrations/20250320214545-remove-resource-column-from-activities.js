module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the 'resource' column from the 'activities' table
    await queryInterface.removeColumn('activities', 'resource');
  },

  down: async (queryInterface, Sequelize) => {
    // In case we need to revert the migration, add back the 'resource' column
    await queryInterface.addColumn('activities', 'resource', {
      type: Sequelize.STRING,
      allowNull: true, // Make it nullable so that it doesn't violate constraints
    });
  },
};
