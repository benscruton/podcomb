const {DataTypes} = require("sequelize");
const {sequelize} = require("../config");
const Comb = require("./comb.model");

const isPostgres = (
  process.env.NODE_ENV === "production" || 
  process.env.NODE_ENV === "postgres"
);

const Filter = sequelize.define(
  "filter",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
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
    }
  },
  {
    tableName: "filters",
    hooks: {
      // If SQLite, stringify before saving
      beforeValidate: filter => {
        if(!isPostgres){
          filter.data = JSON.stringify(filter.data);
        }
      },

      // If SQLite, parse stringified JSON
      afterCreate: filter => {
        if(!isPostgres){
          filter.data = JSON.parse(filter.data);
        } 
      },
      afterUpdate: filter => {
        if(!isPostgres){
          filter.data = JSON.parse(filter.data);
        }
      },
      afterFind: filter => {
        if(!isPostgres){
          filter.data = JSON.parse(filter.data);
        }
      }
    }
  }
);

Comb.hasMany(Filter, {
  foreignKey: {
    name: "combId",
    type: DataTypes.UUID
  },
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});
Filter.belongsTo(Comb);

module.exports = Filter;