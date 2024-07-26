const sanitizeHtml = require("sanitize-html");
const catchAsync = require("./../utils/catchAsync");
const Post = require("./../models/postModel");
const factory = require("./handlerFactory");

exports.recentPosts = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-createdAt";
  req.query.fields = "title,excerpt,createdAt";
  next();
};

exports.getPost = factory.getOne(Post, { path: "author" });
exports.getAllPosts = factory.getAll(Post, { path: "author" });
// exports.createPost = factory.createOne(Post);
exports.updatePost = factory.updateOne(Post);
exports.deletePost = factory.deleteOne(Post);

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
