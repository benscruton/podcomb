require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8000;

app.use(
  cors(),
  express.json(),
  express.urlencoded({extended: true}),
  // express.static("./client/build"),
  require("./server/routes")
);

// Connect to database
// require("./server/config/sequelize");
require("./server/models");

app.listen(port, () => console.log(`Listening on Port ${port}...`));