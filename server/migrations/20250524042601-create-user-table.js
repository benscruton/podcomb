'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const {DataTypes} = Sequelize;

    await queryInterface.createTable(
      'users',
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
    
        username: {
          type: DataTypes.STRING,
          allowNull: false
        },
    
        username_lowercase: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
    
        email: {
          type: DataTypes.STRING,
          unique: true
        },
    
        password: {
          type: DataTypes.TEXT,
          allowNull: false
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
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
