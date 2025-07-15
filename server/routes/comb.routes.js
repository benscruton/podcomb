const {combController} = require("../controllers");
const {middleware: {authentication}} = require("../config");

const combRoutes = require("express").Router();

combRoutes.route("/")
  .post(authentication.clientToken, combController.createComb);

combRoutes.route("/users")
  .get(authentication.clientToken, combController.getUserCombs);

combRoutes.route("/:combId")
  .get(authentication.clientToken, combController.getComb)
  .put(authentication.clientToken, combController.updateComb)
  .delete(authentication.clientToken, combController.deleteComb);

combRoutes.route("/:combId/sourcefeeds")
  .post(authentication.clientToken, combController.addSourceFeed);

combRoutes.route("/:combId/sourcefeeds/:sourceFeedId")
  .put(authentication.clientToken, combController.updateSourceFeed)
  .delete(authentication.clientToken, combController.deleteSourceFeed);

combRoutes.route("/:combId/filters")
  .post(authentication.clientToken, combController.addFilter);

combRoutes.route("/:combId/filters/:filterId")
  .delete(authentication.clientToken, combController.deleteFilter);

combRoutes.route("/:combId/cache")
  .put(authentication.clientToken, combController.cacheFeed)
  .delete(authentication.clientToken, combController.deleteCache);

module.exports = combRoutes;