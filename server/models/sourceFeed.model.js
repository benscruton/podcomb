const {DataTypes, ForeignKeyConstraintError} = require("sequelize");
const {sequelize} = require("../config");
const Comb = require("./comb.model");

const SourceFeed = sequelize.define(
  "SourceFeed",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    url: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    imageUrl: {
      type: DataTypes.TEXT
    }
  },
  {tableName: "source_feeds"}
);

Comb.hasMany(SourceFeed, {
  foreignKey: {
    name: "combId",
    type: DataTypes.UUID
  },
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});
SourceFeed.belongsTo(Comb);

module.exports = SourceFeed;