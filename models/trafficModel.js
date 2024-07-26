const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trafficSchema = new Schema({
  date: { type: Date, required: true, unique: true },
  dailyCount: { type: Number, default: 0 },
  monthlyCount: { type: Number, default: 0 },
  allTimeCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Traffic', trafficSchema);
