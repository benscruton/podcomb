'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const {DataTypes} = Sequelize;

    // Add cacheInterval column
    await queryInterface.addColumn(
      "combs",
      "cache_interval",
      {
        type: DataTypes.INTEGER
      }
    );

    // Add cachedAt column
    await queryInterface.addColumn(
      "combs",
      "cached_at",
      {
        type: DataTypes.DATE
      }
    );
  },

  async down (queryInterface, Sequelize) {
    // Drop newly added columns
    await queryInterface.removeColumn(
      "combs",
      "cache_interval"
    );

    await queryInterface.removeColumn(
      "combs",
      "cached_at"
    );
  }
};
