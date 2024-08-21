const Post = require('../models/postModel'); // Adjust the path according to your project structure

const checkPostOwnership = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        status: 'fail',
        message: 'Post not found',
      });
    }

    // Admins can access all posts
    if (req.user.role === 'admin') {
      return next();
    }

    // Only authenticated users can access their own posts
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action',
      });
    }

    req.post = post; // Store the post in the request object for use in the controller
    next();
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
};

module.exports = checkPostOwnership;
