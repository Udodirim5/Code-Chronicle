const mongoose = require("mongoose");
const Category = require("./../models/categoryModel");
const sanitizeHtml = require("sanitize-html");
const catchAsync = require("./../utils/catchAsync");
const Post = require("./../models/postModel");
const factory = require("./handlerFactory");

exports.recentPosts = (req, res, next) => {
  req.query.limit = "6";
  req.query.sort = "-createdAt";
  req.query.fields = "title,excerpt,createdAt";
  next();
};

exports.getPost = factory.getOne(Post, { path: "author" });
exports.getAllPosts = factory.getAll(Post, { path: "author" });
exports.updatePost = factory.updateOne(Post);
exports.deletePost = factory.deleteOne(Post);

// Sanitize and validate post data
exports.submitPost = catchAsync(async (req, res) => {
  const sanitizedContent = sanitizeHtml(req.body.content, {
    allowedTags: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "ul",
      "li",
      "img",
      "a",
      "pre",
      "code",
    ],
    allowedAttributes: {
      a: ["href", "name", "target"],
      img: ["src"],
    },
  });

  const { title, excerpt, tags, category, published } = req.body;
  const photo = req.file;

  if (!mongoose.Types.ObjectId.isValid(category)) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid category ID",
    });
  }

  if (!title || !req.body.content || !excerpt || !category) {
    return res.status(400).json({
      status: "fail",
      message: "Missing required fields",
    });
  }

  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    return res.status(400).json({
      status: "fail",
      message: "Category does not exist",
    });
  }

  const newPost = new Post({
    title,
    content: sanitizedContent,
    excerpt,
    tags: tags.split(","),
    category: mongoose.Types.ObjectId(category),
    photo: photo ? photo.filename : undefined,
    author: req.user._id,
    published: published === "true",
  });

  const post = await newPost.save();
  res.status(201).json({
    status: "success",
    data: {
      post,
    },
  });
});

// Like a post
// router.post('/posts/:id/like', authController.protect, async (req, res) => {
//   const post = await Post.findById(req.params.id);
//   if (!post) {
//     return res.status(404).json({ status: "fail", message: "Post not found" });
//   }

//   await post.addLike(req.user._id); // Add like
//   res.status(200).json({ status: "success", message: "Post liked" });
// });

// // Dislike a post
// router.post('/posts/:id/dislike', authController.protect, async (req, res) => {
//   const post = await Post.findById(req.params.id);
//   if (!post) {
//     return res.status(404).json({ status: "fail", message: "Post not found" });
//   }

//   await post.addDislike(req.user._id); // Add dislike
//   res.status(200).json({ status: "success", message: "Post disliked" });
// });
