require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8000;
const cookieParser = require("cookie-parser");

app.use(
  cookieParser(),
  cors({
    credentials: true,
    origin: (origin, callback) => callback(null, true)
  }),
  express.json(),
  express.urlencoded({extended: true}),
  express.static("./client/dist"),
  require("./server/routes")
);

// Load models and connect to database
require("./server/models");

// Load cron jobs (for caching XML)
require("./server/config/cron");



app.listen(port, () => console.log(`Listening on Port ${port}...`));