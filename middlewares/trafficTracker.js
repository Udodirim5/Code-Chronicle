const mongoose = require("mongoose");
const Traffic = require("../models/trafficModel");

const trafficTracker = async (req, res, next) => {
  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  try {
    // Update daily traffic
    const dailyTraffic = await Traffic.findOneAndUpdate(
      { date: startOfToday },
      { $inc: { dailyCount: 1, allTimeCount: 1 } },
      { upsert: true, new: true }
    );

    // Update monthly traffic
    const monthlyTraffic = await Traffic.updateMany(
      { date: { $gte: startOfMonth } },
      { $inc: { monthlyCount: 1 } }
    );

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = trafficTracker;
