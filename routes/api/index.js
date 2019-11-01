const router = require("express").Router();
const trackRoutes = require("./tracks");


router.use("/tracks", trackRoutes);

module.exports = router;
