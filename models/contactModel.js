const mongoose = require("mongoose");
const validator = require("validator");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "a name is required"],
    minlength: [3, "Name must not be less than 3 characters"],
    maxlength: [50, "Name must not be more than 50 characters"],
    trim: true,
  },

  email: {
    type: String,
    required: [true, "an email address is required"],
    validate: [validator.isEmail, "Please provide a valid email address"],
  },

  message: {
    type: String,
    required: [true, "A message is required"],
    minlength: [10, "Message must not be less than 10 characters"],
    maxlength: [500, "Message must not be more than 500 characters"],
    trim: true,
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
