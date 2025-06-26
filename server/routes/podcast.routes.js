const {podcastController} = require("../controllers");

const podcastRoutes = require("express").Router();

podcastRoutes.route("/test")
  .get(podcastController.test);

podcastRoutes.route("/relay/:show")
  .get(podcastController.relay);

podcastRoutes.route("/transform/:show")
  .get(podcastController.transform);

podcastRoutes.route("/combine/:show1/:show2")
  .get(podcastController.combine);

podcastRoutes.route("/xml/:file")
  .get(podcastController.staticXml);

podcastRoutes.route("/cache/:show")
  .get(podcastController.cacheFeed);

module.exports = podcastRoutes;