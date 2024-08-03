const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A post must have a title"],
      trim: true,
    },
    secretPost: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      required: [true, "A post must have content"],
      trim: true,
    },
    excerpt: {
      type: String,
      required: [true, "A post must have an excerpt"],
      trim: true,
    },
    photo: {
      type: String,
      default: "default.png",
    },
    images: [String],
    tags: [
      {
        type: String,
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    slug: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "A post must belong to a category"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A post must belong to an author"],
    },
    updatedAt: { type: Date },
    published: { type: Boolean, default: false },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
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

// Indexing for slug to ensure uniqueness and efficient querying
postSchema.index({ slug: 1 });

// Increment views middleware
postSchema.methods.incrementViews = async function () {
  this.views += 1;
  await this.save();
};

// Add a like
postSchema.methods.addLike = async function (userId) {
  if (!this.likes.includes(userId)) {
    this.likes.push(userId);
    // Remove from dislikes if already present
    this.dislikes = this.dislikes.filter(id => id.toString() !== userId.toString());
    await this.save();
  }
};

// Add a dislike
postSchema.methods.addDislike = async function (userId) {
  if (!this.dislikes.includes(userId)) {
    this.dislikes.push(userId);
    // Remove from likes if already present
    this.likes = this.likes.filter(id => id.toString() !== userId.toString());
    await this.save();
  }
};

// Remove a like
postSchema.methods.removeLike = async function (userId) {
  this.likes = this.likes.filter(id => id.toString() !== userId.toString());
  await this.save();
};

// Remove a dislike
postSchema.methods.removeDislike = async function (userId) {
  this.dislikes = this.dislikes.filter(id => id.toString() !== userId.toString());
  await this.save();
};

// Document middleware: runs before .save() and .create()
postSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    // Slugify the title to create a URL-friendly version
    let slug = slugify(this.title, { lower: true });

    // Check if the slug already exists and handle duplicates
    const existingPost = await mongoose.model("Post").findOne({ slug });
    if (existingPost && existingPost._id.toString() !== this._id.toString()) {
      slug = `${slug}-${Date.now()}`;
    }

    this.slug = slug;

    // Update the updatedAt field
    this.updatedAt = Date.now();
  }

  next();
});

// Query middleware: runs before any find query
postSchema.pre(/^find/, function (next) {
  // Populate the author and category fields with referenced data
  this.populate({
    path: "author",
    select: "name"
  }).populate({
    path: "category",
    select: "name username"
  });

  next();
});

// Aggregation middleware: runs before any aggregate query
postSchema.pre("aggregate", function (next) {
  // Add a match stage to filter out secret posts unless explicitly included
  this.pipeline().unshift({ $match: { secretPost: { $ne: true } } });

  next();
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
