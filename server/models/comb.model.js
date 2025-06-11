const {DataTypes} = require("sequelize");
const {sequelize} = require("../config");
const User = require("./user.model");

const Comb = sequelize.define(
  "comb",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
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
    
    imageUrl: {
      type: DataTypes.TEXT
    },
    
    category: {
      type: DataTypes.STRING
    },

    link: {
      type: DataTypes.TEXT
    },

    isExplicit: {
      type: DataTypes.BOOLEAN
    },

    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {tableName: "combs"}
);

User.hasMany(Comb, {
  foreignKey: {
    name: "userId",
    type: DataTypes.UUID
  },
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});
Comb.belongsTo(User);

module.exports = Comb;