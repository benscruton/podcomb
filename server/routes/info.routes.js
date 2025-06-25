const {infoController} = require("../controllers");

const infoRoutes = require("express").Router();

infoRoutes.route("/host")
  .get(infoController.getHost);

module.exports = infoRoutes;