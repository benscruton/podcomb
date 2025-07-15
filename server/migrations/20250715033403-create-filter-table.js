'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const {DataTypes} = Sequelize;

    const isPostgres = (
      process.env.NODE_ENV === "production" || 
      process.env.NODE_ENV === "postgres"
    );

    // Create Filters table
    await queryInterface.createTable(
      "filters",
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        comb_id: {
          type: DataTypes.UUID
        },
        name: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        type: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        data: {
          type: (isPostgres ?
            DataTypes.JSONB
            :
            DataTypes.TEXT
          )
        },
        created_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW
        },
        updated_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW
        }
      }
    );

    // Create foreign key constraints
    await queryInterface.addConstraint("filters", {
      fields: ["comb_id"],
      type: "foreign key",
      name: "filters_comb_id__fk",
      references: {
        table: "combs",
        field: "id"
      },
      onDelete: "cascade",
      onUpdate: "cascade"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("filters");
  }
};
