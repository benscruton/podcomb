const {DataTypes} = require("sequelize");
const sequelize = require("../config/sequelize");
const bcrypt = require("bcrypt");

const User = sequelize.define(
  "User",
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

    usernameLowercase: {
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
    }
  },
  {
    tableName: "users",
    hooks: {
      beforeValidate: user => {
        user.usernameLowercase = user.username.toLowerCase();
        user.email = user.email.toLowerCase();
        delete user.confirmPassword;
      },
      beforeCreate: async user => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
      },
      afterCreate: user => {
        delete user.dataValues.password;
        delete user.dataValues.usernameLowercase;
      },
      afterUpdate: user => {
        delete user.dataValues.password;
        delete user.dataValues.usernameLowercase;
      }
    }
  }
);

module.exports = User;