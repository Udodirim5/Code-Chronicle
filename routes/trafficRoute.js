const express = require("express");
const router = express.Router();
const Traffic = require("../models/trafficModel");
const trafficController = require("../controllers/trafficController");


router.get("/traffic/daily", trafficController.getDailyTraffic);
router.get("/traffic/monthly", trafficController.getMonthlyTraffic);
router.get("/traffic/all-time", trafficController.getAllTimeTraffic);

module.exports = router;
