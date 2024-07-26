const Post = require("../models/postModel");
const catchAsync = require("../utils/catchAsync");

const relatedPosts = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Fetch the current post by ID
  const currentPost = await Post.findById(id);

  if (!currentPost) {
    return res.status(404).json({
      status: "fail",
      message: "Post not found",
    });
  }

  // Fetch related posts with matching tags, excluding the current post
  const related = await Post.find({
    tags: { $in: currentPost.tags },
    _id: { $ne: currentPost._id },
  })
    .limit(5)
    .select("title content excerpt tags views slug createdAt");

  // Send related posts in the response
  res.status(200).json({
    status: "success",
    data: {
      relatedPosts: related,
    },
  });
});

module.exports = relatedPosts;
