const {DataTypes} = require("sequelize");
const {sequelize} = require("../config");
const Comb = require("./comb.model");

const isPostgres = (
  process.env.NODE_ENV === "production" || 
  process.env.NODE_ENV === "postgres"
);

const parseFilterJson = filter => {
  if(!isPostgres){
    filter.data = JSON.parse(filter.data);
  } 
};

const stringifyFilterJson = filter => {
  if(!isPostgres && typeof filter.data === "object"){
    filter.data = JSON.stringify(filter.data);
  }
};

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

    priority: {
      type: DataTypes.SMALLINT,
      defaultValue: 100
    },

    data: {
      type: (isPostgres ?
        DataTypes.JSONB
        :
        DataTypes.TEXT
      )
    },

    isDisabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    tableName: "filters",
    hooks: {
      // If SQLite, stringify before saving
      beforeValidate: stringifyFilterJson,

      // If SQLite, parse stringified JSON
      afterCreate: parseFilterJson,
      afterUpdate: filter => {
        // console.log(filter);
        // console.log("\n");
        parseFilterJson(filter);
        // console.log(filter);
      },
      afterFind: parseFilterJson
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