const {DataTypes} = require("sequelize");
const axios = require("axios");
const xml2js = require("xml2js");
const {sequelize} = require("../config");
const Comb = require("./comb.model");

const SourceFeed = sequelize.define(
  "sourceFeed",
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
  {
    tableName: "source_feeds",
    hooks: {
      beforeCreate: async sourceFeed => {
        await axios.get(sourceFeed.url)
          .then(({data}) => {
            xml2js.parseString(data, (err, result) => {
              sourceFeed.imageUrl = result.rss.channel[0].image[0].url[0];
            });
          })
          .catch(e => console.log(e.message));
      }
    }
  }
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