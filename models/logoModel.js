const mongoose = require("mongoose");

const logoSchema = new mongoose.Schema({
  logoText: {
    type: String,
    required: [true, "A website must have a logo text"],
  },

  image: {
    type: String,
    required: [true, "A website must have an logo image"],
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
});

const Logo = mongoose.model("Logo", logoSchema);

module.exports = Logo;
