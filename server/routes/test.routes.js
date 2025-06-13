const testRoutes = require("express").Router();

testRoutes.route("/")
  .get((req, rsp) => {
    rsp.json({pass: true});
  });

module.exports = testRoutes;