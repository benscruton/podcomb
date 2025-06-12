const {combController} = require("../controllers");
const {middleware: {authentication}} = require("../config");

const combRouter = require("express").Router();

combRouter.route("/")
  .post(authentication.clientToken, combController.createComb);

combRouter.route("/:combId")
  .get(authentication.clientToken, combController.getComb)
  .put(authentication.clientToken, combController.updateComb)
  .delete(authentication.clientToken, combController.deleteComb);

combRouter.route("/users/me")
  .get(authentication.clientToken, combController.getUserCombs);

combRouter.route("/:combId/sourcefeeds")
  .post(authentication.clientToken,combController.addSourceFeed);

combRouter.route("/:combId/sourcefeeds/:sourceFeedId")
  .delete(authentication.clientToken, combController.deleteSourceFeed);

module.exports = combRouter;