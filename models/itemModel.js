const mongoose = require("mongoose");
const slugify = require("slugify");

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "An item must have a name."],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "An item must have a description."],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
      match: /^[a-z0-9-]+$/,
    },
    price: {
      type: Number,
      required: [true, "An item must have a price."],
    },
    itemImage: {
      type: String,
      required: [true, "An item must have an image URL."],
    },
    itemZipFile: {
      type: String,
      required: [true, "An item must have a URL."],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "An item must belong to an user."],
    },
    updatedAt: {
      type: Date,
    },
    published: {
      type: Boolean,
      default: false,
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

itemSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "item",
});

itemSchema.pre(/^find/, function(next) {
  this.populate("createdBy");
  next();
});

// Pre hook: runs before a document is removed
itemSchema.pre('remove', async function (next) {
  try {
    // Remove all Reviews where the postId matches this post's ID
    await Review.deleteMany({ itemId: this._id });
    next();
  } catch (err) {
    next(err);
  }
});


itemSchema.pre("save", async function(next) {
  // If the itemName is not modified, proceed to the next middleware
  if (!this.isModified("name")) return next();

  // Slugify the itemName to create a URL-friendly version
  let slug = slugify(this.name, { lower: true });

  // Check if the slug already exists and handle duplicates
  const existingItem = await mongoose.model("Item").findOne({ slug });
  if (existingItem && existingItem._id.toString() !== this._id.toString()) {
    slug = `${slug}-${Date.now()}`;
  }

  this.slug = slug;

  // Update the updatedAt field
  this.updatedAt = Date.now();

  next();
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
