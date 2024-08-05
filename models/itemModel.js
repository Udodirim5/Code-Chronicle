const mongoose = require("mongoose");
const slugify = require("slugify");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "An item must have a name."],
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
  itemUrl: {
    type: String,
    required: [true, "An item must have a URL."],
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
    default: Date.now(),
  },
});

itemSchema.pre(/^find/, function (next) {
  this.populate("createdBy");
  next();
});

itemSchema.pre("save", async function (next) {
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
