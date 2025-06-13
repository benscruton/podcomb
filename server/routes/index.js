const router = require("express").Router();

const testRoutes = require("./test.routes");
const authRoutes = require("./auth.routes");
const combRoutes = require("./comb.routes");
const podcastRoutes = require("./podcast.routes");
const feedRoutes = require("./feed.routes");

router.use("/api/test", testRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/combs", combRoutes);
router.use("/api/podcasts", podcastRoutes);
router.use("/feeds", feedRoutes);

module.exports = router;