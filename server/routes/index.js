const router = require("express").Router();

const testRoutes = require("./test.routes");
const podcastRoutes = require("./podcast.routes");

router.use("/api/test", testRoutes);
router.use("/api/podcasts", podcastRoutes);

module.exports = router;