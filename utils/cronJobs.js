const cron = require("node-cron");
const Traffic = require("./../models/trafficModel");
const catchAsync = require("./catchAsync");

// Function to reset daily traffic count
const resetDailyTraffic = catchAsync(async () => {
  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  await Traffic.updateMany({ date: { $lt: startOfToday } }, { dailyCount: 0 });
  showAlert('success', "Daily traffic count reset successfully.");
});

// Function to reset monthly traffic count
const resetMonthlyTraffic = catchAsync(async () => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  await Traffic.updateMany(
    { date: { $lt: startOfMonth } },
    { monthlyCount: 0 }
  );
  showAlert('success', "Monthly traffic count reset successfully.");
});

// Schedule daily reset at midnight
cron.schedule("0 0 * * *", resetDailyTraffic);

// Schedule monthly reset at midnight on the first day of the month
cron.schedule("0 0 1 * *", resetMonthlyTraffic);
