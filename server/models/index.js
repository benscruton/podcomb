const Comb = require("./comb.model");
const Filter = require("./filter.model");
const SourceFeed = require("./sourceFeed.model");
const User = require("./user.model");

// const {sequelize} = require("../config");
// sequelize.sync({force: true})
//   .then(() => console.log("Database sunc successfully"))
//   .catch(e => console.log("Database sync failed:", e));

module.exports = {
  Comb,
  Filter,
  SourceFeed,
  User
};