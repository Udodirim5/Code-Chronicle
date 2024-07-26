const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const Traffic = require("./../models/trafficModel");

exports.getDailyTraffic = catchAsync(async (req, res) => {
  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const dailyTraffic = await Traffic.findOne({ date: startOfToday });

  res.json(dailyTraffic || { dailyCount: 0, allTimeCount: 0 });
});

exports.getAllTimeTraffic = catchAsync( async (req, res) => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const monthlyTraffic = await Traffic.aggregate([
    { $match: { date: { $gte: startOfMonth } } },
    {
      $group: {
        _id: null,
        monthlyCount: { $sum: "$monthlyCount" },
      },
    },
  ]);

  res.json(monthlyTraffic[0] || { monthlyCount: 0 });

});

exports.getMonthlyTraffic = catchAsync( async (req, res) => {
  const allTimeTraffic = await Traffic.aggregate([
    {
      $group: {
        _id: null,
        allTimeCount: { $sum: "$allTimeCount" },
      },
    },
  ]);

  res.json(allTimeTraffic[0] || { allTimeCount: 0 });

});
