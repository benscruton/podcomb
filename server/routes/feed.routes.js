const {combController} = require("../controllers");

const feedRoutes = require("express").Router();

feedRoutes.route("/:combId")
  .get(combController.sendCombXml);

module.exports = feedRoutes;