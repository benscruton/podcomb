const {authController} = require("../controllers");
const {middleware: {authentication}} = require("../config");

const authRoutes = require("express").Router();

authRoutes.route("/register")
  .post(authentication.apiKey, authController.register);

authRoutes.route("/login")
  .post(authController.login);

authRoutes.route("/logout")
  .get(authController.logout);

module.exports = authRoutes;