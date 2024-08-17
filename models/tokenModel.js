const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  purchase: {
    type: mongoose.Schema.ObjectId,
    ref: 'Purchase',
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
});

// Create a TTL index on the expiresAt field
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
