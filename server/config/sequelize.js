const { Sequelize } = require("sequelize");

const {NODE_ENV} = process.env;

let sequelize;

// USE POSTGRES:
if(NODE_ENV === "production" || NODE_ENV === "postgres"){
  const {
    POSTGRES_USER: user,
    POSTGRES_PASSWORD: pass,
    POSTGRES_DB: dbname,
    POSTGRES_HOST: host,
    POSTGRES_PORT: port
  } = process.env;

  sequelize = new Sequelize(
    `postgres://${user}:${pass}@${host}:${port}/${dbname}`,
    {
      logging: false,
      define: {
        // Convert database column names to snake_case
        underscored: true
      }
    }
  );
}

// WITH SQLITE:
else{
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./data/db.sqlite3",
    logging: false,
    define: {
      // Convert database column names to snake_case
      underscored: true
    }
  });
}
 
sequelize.authenticate()
  .then(() => console.log("Database connection established"))
  .catch(e => {
    console.log("Database connection failed:")
    console.log(e);
  });

module.exports = sequelize;