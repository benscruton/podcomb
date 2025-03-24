const testRouter = require("express").Router();

testRouter.route("/")
  .get((req, rsp) => {
    rsp.json({pass: true});
  });

module.exports = testRouter;