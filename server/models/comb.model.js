const {DataTypes} = require("sequelize");
const {sequelize} = require("../config");
const User = require("./user.model");

const parseFilterJson = comb => {
  const isPostgres = (
    process.env.NODE_ENV === "production" || 
    process.env.NODE_ENV === "postgres"
  );

  if(!isPostgres && comb.filters?.length){
    comb.filters.forEach(filter => {
      if(typeof filter.data === "string"){
        filter.data = JSON.parse(filter.data);
      }
    });
  }
}

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
    },

    cacheInterval: {
      type: DataTypes.INTEGER
    },

    cachedAt: {
      type: DataTypes.DATE
    },

    replaceFilteredEpisodeMedia: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    tableName: "combs",
    hooks: {
      afterFind: parseFilterJson,
      afterUpdate: parseFilterJson
    }
  }
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