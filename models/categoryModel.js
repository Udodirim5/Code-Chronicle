const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A category must have a name'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create an index on the name field to enforce uniqueness at the database level
categorySchema.index({ name: 1 }, { unique: true });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
