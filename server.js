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



app.listen(port, () => console.log(`Now listening on Port ${port}...`));