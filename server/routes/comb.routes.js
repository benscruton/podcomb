const {combController} = require("../controllers");
const {middleware: {authentication}} = require("../config");

const combRoutes = require("express").Router();

combRoutes.route("/")
  .post(authentication.clientToken, combController.createComb);

combRoutes.route("/:combId")
  .get(authentication.clientToken, combController.getComb)
  .put(authentication.clientToken, combController.updateComb)
  .delete(authentication.clientToken, combController.deleteComb);

combRoutes.route("/users/me")
  .get(authentication.clientToken, combController.getUserCombs);

combRoutes.route("/:combId/sourcefeeds")
  .post(authentication.clientToken,combController.addSourceFeed);

combRoutes.route("/:combId/sourcefeeds/:sourceFeedId")
  .delete(authentication.clientToken, combController.deleteSourceFeed);

module.exports = combRoutes;