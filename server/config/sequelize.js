const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./data/db.sqlite3",
  logging: false,
  define: {
    // Convert database column names to snake_case
    underscored: true
  }
});
 
sequelize.authenticate()
  .then(() => console.log("Database connection established"))
  .catch(e => {
    console.log("Database connection failed:")
    console.log(e);
  });

module.exports = sequelize;