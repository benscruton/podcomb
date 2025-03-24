const {podcastController} = require("../controllers");

const podcastRouter = require("express").Router();

podcastRouter.route("/test")
  .get(podcastController.test);

podcastRouter.route("/relay/:show")
  .get(podcastController.relay);

podcastRouter.route("/transform/:show")
  .get(podcastController.transform);

podcastRouter.route("/combine/:show1/:show2")
  .get(podcastController.combine);

module.exports = podcastRouter;