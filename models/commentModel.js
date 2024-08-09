const mongoose = require("mongoose");
const validator = require("validator");

const commentSchema = new mongoose.Schema(
  {
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

    comment: {
      type: String,
      required: [true, "A comment is required"],
      minlength: [10, "Comment must not be less than 10 characters"],
      maxlength: [900, "Comment must not be more than 900 characters"],
      trim: true,
    },

    post: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      required: [true, "Review must belong to an post."],
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

commentSchema.index({ post: 1, email: 1 }, { unique: true });

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
