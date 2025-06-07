const router = require("express").Router();

const testRoutes = require("./test.routes");
const authRoutes = require("./auth.routes");
const combRoutes = require("./comb.routes");
const podcastRoutes = require("./podcast.routes");

router.use("/api/test", testRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/combs", combRoutes);
router.use("/api/podcasts", podcastRoutes);

module.exports = router;