const {combController} = require("../controllers");
const {middleware: {authentication}} = require("../config");

const combRouter = require("express").Router();

combRouter.route("/")
  .post(authentication.clientToken, combController.createComb);

module.exports = combRouter;