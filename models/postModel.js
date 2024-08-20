const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const slugify = require("slugify");

const catchAsync = require("../utils/catchAsync");

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

postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
});

// Indexing for slug to ensure uniqueness and efficient querying
postSchema.index({ slug: 1 }, { unique: true });

// Increment views middleware
postSchema.methods.incrementViews = async function() {
  console.log("Views before:", this.views); // Debug log
  this.views += 1;
  await this.save();
  console.log("Views after:", this.views); // Debug log
};

// Add or Remove Like
postSchema.methods.toggleLike = async function(userId) {
  try {
    if (this.likes.includes(userId)) {
      // If the user has already liked the post, remove the like
      this.likes = this.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // Otherwise, add the like and remove any existing dislike
      this.likes.push(userId);
      this.dislikes = this.dislikes.filter(
        (id) => id.toString() !== userId.toString()
      );
    }
    await this.save();
  } catch (err) {
    console.error(err);
  }
};

// Add or Remove Dislike
postSchema.methods.toggleDislike = async function(userId) {
  try {
    if (this.dislikes.includes(userId)) {
      // If the user has already disliked the post, remove the dislike
      this.dislikes = this.dislikes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // Otherwise, add the dislike and remove any existing like
      this.dislikes.push(userId);
      this.likes = this.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    }
    await this.save();
  } catch (err) {
    console.error(err);
  }
};

postSchema.pre("save", async function(next) {
  if (this.isModified("title")) {
    let slug = slugify(this.title, { lower: true });

    // Handle slug uniqueness
    const existingPost = await mongoose.model("Post").findOne({ slug });
    if (existingPost && existingPost._id.toString() !== this._id.toString()) {
      slug = `${slug}-${Date.now()}`;
    }

    this.slug = slug;
  }

  // Ensure `updatedAt` is set whenever the document is modified
  this.updatedAt = Date.now();
  next();
});

// Pre hook: runs before a document is removed
postSchema.pre("remove", async function(next) {
  // Remove all comments where the postId matches this post's ID
  await Comment.deleteMany({ postId: this._id });

  // Handle file deletion on post removal
  if (this.photo) {
    const imagePath = path.join(__dirname, "..", this.photo);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
  next();
});

// Middleware for findOneAndDelete
// postSchema.pre(
//   "findOneAndDelete",
//   catchAsync(async function (next) {
//     const post = await this.model.findOne(this.getQuery()); // Safely fetch the document
//     if (post && post.photo) {
//       const imagePath = path.join(__dirname, "..", post.photo);
//       if (fs.existsSync(imagePath)) {
//         fs.unlinkSync(imagePath);
//       }
//     }
//     next();
//   })
// );

// Middleware to handle file updates
// postSchema.pre("save", async function(next) {
//   if (this.isModified("photo") && this.photo) {
//     const oldPost = await this.model.findById(this._id);
//     if (oldPost && oldPost.photo !== this.photo) {
//       const oldImagePath = path.join(__dirname, "..", oldPost.photo);
//       if (fs.existsSync(oldImagePath)) {
//         try {
//           fs.unlinkSync(oldImagePath);
//         } catch (err) {
//           console.error(`Error deleting old file at ${oldImagePath}:`, err);
//         }
//       }
//     }
//   }
//   next();
// });

postSchema.pre(/^find/, function(next) {
  // Populate the author and category fields with referenced data
  this.populate({
    path: "author",
    select: "name",
  }).populate({
    path: "category",
    select: "name username",
  });

  next();
});

postSchema.pre("aggregate", function(next) {
  // Add a match stage to filter out secret posts unless explicitly included
  this.pipeline().unshift({ $match: { secretPost: { $ne: true } } });

  next();
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
