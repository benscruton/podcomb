require("dotenv").config();

const sqlite = {
  dialect: "sqlite",
  storage: "./data/db.sqlite3"
};

const postgres = {
  dialect: "postgres",
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT
};

module.exports = {
  sqlite,
  postgres,
  development: sqlite,
  production: postgres
};