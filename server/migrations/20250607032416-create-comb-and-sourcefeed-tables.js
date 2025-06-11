'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const {DataTypes} = Sequelize;
    
    // Create Combs table
    await queryInterface.createTable(
      "combs",
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        user_id: {
          type: DataTypes.UUID
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false
        },
        author: {
          type: DataTypes.STRING,
        },
        description: {
          type: DataTypes.TEXT
        },
        language: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "en",
        },
        image_url: {
          type: DataTypes.TEXT
        },
        category: {
          type: DataTypes.STRING
        },
        link: {
          type: DataTypes.TEXT
        },
        is_explicit: {
          type: DataTypes.BOOLEAN
        },
        is_public: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
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

    // Create SourceFeeds table
    await queryInterface.createTable(
      "source_feeds",
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        comb_id: {
          type: DataTypes.UUID
        },
        title: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        url: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        image_url: {
          type: DataTypes.TEXT
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
    await queryInterface.addConstraint("combs", {
      fields: ["user_id"],
      type: "foreign key",
      name: "combs_user_id__fk",
      references: {
        table: "users",
        field: "id"
      },
      onDelete: "cascade",
      onUpdate: "cascade"
    });

    await queryInterface.addConstraint("source_feeds", {
      fields: ["comb_id"],
      type: "foreign key",
      name: "source_feeds_comb_id__fk",
      references: {
        table: "combs",
        field: "id"
      },
      onDelete: "cascade",
      onUpdate: "cascade"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("source_feeds");
    await queryInterface.dropTable("combs");
  }
};
