const {authController} = require("../controllers");
const {middleware: {authentication}} = require("../config");

const authRouter = require("express").Router();

authRouter.route("/register")
  .post(authentication.apiKey, authController.register);

authRouter.route("/login")
  .post(authController.login);

authRouter.route("/logout")
  .get(authController.logout);

module.exports = authRouter;