const mongoose = require("mongoose");

const socialSchema = new mongoose.Schema({
  twitter: {
    type: String,
  },

  facebook: {
    type: String,
  },

  telegram: {
    type: String,
  },

  github: {
    type: String,
  },

  instagram: {
    type: String,
  },

  linkedin: {
    type: String,
  },

  youtube: {
    type: String,
  },

  whatsapp: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Social = mongoose.model("Social", socialSchema);

module.exports = Social;
