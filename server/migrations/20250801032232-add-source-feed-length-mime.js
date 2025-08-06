'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const {DataTypes} = Sequelize;

    await queryInterface.addColumn(
      "source_feeds",
      "replacement_media_length",
      {type: DataTypes.INTEGER}
    );

    await queryInterface.addColumn(
      "source_feeds",
      "replacement_media_mime",
      {type: DataTypes.TEXT}
    );
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.removeColumn(
        "source_feeds",
        "replacement_media_length",
      );
      await queryInterface.removeColumn(
        "source_feeds",
        "replacement_media_mime",
      );
  }
};
