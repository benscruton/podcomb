'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const {DataTypes} = Sequelize;

    await queryInterface.addColumn(
      "filters",
      "is_disabled",
      {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    );

    await queryInterface.addColumn(
      "combs",
      "replace_filtered_episode_media",
      {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    );

    await queryInterface.addColumn(
      "source_feeds",
      "filtered_media_replacement",
      {
        type: DataTypes.TEXT,
        defaultValue: "image"
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      "filters",
      "is_disabled"
    );
    await queryInterface.removeColumn(
      "combs",
      "replace_filtered_episode_media"
    );
    await queryInterface.removeColumn(
      "source_feeds",
      "filtered_media_replacement"
    );
  }
};
