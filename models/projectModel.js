const mongoose = require("mongoose");
const { isURL } = require("validator");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    minlength: [3, "Title must be at least 3 characters long"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    minlength: [10, "Description must be at least 10 characters long"],
  },
  liveUrl: {
    type: String,
    required: [true, "Live URL is required"],
    trim: true,
    validate: [isURL, "Invalid URL"],
  },
  gitHubUrl: {
    type: String,
    required: [true, "GitHub URL is required"],
    trim: true,
    validate: [isURL, "Invalid URL"],
  },
  technologies: [String],
  desktopView: {
    type: String,
    required: [true, "Desktop view image is required"],
    trim: true,
    // validate: [isURL, "Invalid URL"],
  },
  mobileView: {
    type: String,
    required: [true, "Mobile view image is required"],
    trim: true,
    // validate: [isURL, "Invalid URL"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
