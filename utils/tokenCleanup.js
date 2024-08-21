const cron = require('node-cron');
const Token = require('../models/tokenModel');

// Run a cleanup every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    // Delete tokens that are either expired or used
    await Token.deleteMany({
      $or: [
        { expiresAt: { $lt: Date.now() } },
        { used: true }
      ]
    });
    showAlert('success', "Old tokens cleaned up.");
  } catch (err) {
    showAlert('error', "Error cleaning up tokens:", err);
  }
});
