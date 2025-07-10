'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const {DataTypes} = Sequelize;

    // Add overrideEpisodeImage boolean
    await queryInterface.addColumn(
      "source_feeds",
      "override_episode_image",
      {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    );

    // Add override image url column
    await queryInterface.addColumn(
      "source_feeds",
      "override_image_url",
      {
        type: DataTypes.TEXT
      }
    );
  },

  async down (queryInterface, Sequelize) {
    // Drop newly added columns
    await queryInterface.removeColumn(
      "source_feeds",
      "override_episode_image"
    );

    await queryInterface.removeColumn(
      "source_feeds",
      "override_image_url"
    );
  }
};
