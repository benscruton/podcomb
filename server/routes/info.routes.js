const {infoController} = require("../controllers");

const infoRoutes = require("express").Router();

infoRoutes.route("/")
  .get(infoController.getInfo);

module.exports = infoRoutes;