const router = require("express").Router();

const testRoutes = require("./test.routes");
const authRoutes = require("./auth.routes");
const podcastRoutes = require("./podcast.routes");

router.use("/api/test", testRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/podcasts", podcastRoutes);

module.exports = router;