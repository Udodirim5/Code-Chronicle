const mongoose = require("mongoose");
const Item = require("./itemModel");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title can not be empty!"],
      trim: true,
    },
    review: {
      type: String,
      required: [true, "Review can not be empty!"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Rating is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    item: {
      type: mongoose.Schema.ObjectId,
      ref: "Item",
      required: [true, "Review must belong to an item."],
    },
    name: {
      type: String,
      required: [true, "Review must have a name."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Review must have an email."],
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address."],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ post: 1, email: 1 }, { unique: true });

// reviewSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: "item",
//     select: "name -createdBy",
//   });
//   next();
// });

reviewSchema.statics.calcAverageRatings = async function(itemId) {
  const stats = await this.aggregate([
    {
      $match: { item: itemId },
    },
    {
      $group: {
        _id: "$item",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Item.findByIdAndUpdate(itemId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Item.findByIdAndUpdate(itemId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post("save", function() {
  this.constructor.calcAverageRatings(this.item);
});

reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  await this.r.constructor.calcAverageRatings(this.r.item);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
