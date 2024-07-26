const express = require('express');
const multer = require('multer');
const sanitizeHtml = require('sanitize-html');
const mongoose = require('mongoose');
const authController = require('./../controllers/authController');
const Post = require('./../models/postModel');
const Category = require('./../models/categoryModel');
const User = require('./../models/userModel'); // Make sure to import the User model if not already done

const postController = require("./../controllers/postController");
const relatedPosts = require("../middlewares/relatedPosts");

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/submit-post', upload.single('photo'), authController.protect, async (req, res) => {

  // Sanitize the content
  const sanitizedContent = sanitizeHtml(req.body.content, {
    allowedTags: [
      "h1", "h2", "h3", "h4", "h5", "h6", "p", "ul", "li", "img", "a", "pre", "code"
    ],
    allowedAttributes: {
      a: ["href", "name", "target"],
      img: ["src"],
    },
  });

  const { title, excerpt, tags, category, published } = req.body;
  const photo = req.file;

  // Validate ObjectId for category
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

  try {
    // Ensure the category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        status: "fail",
        message: "Category does not exist",
      });
    }

    // Process and save the post
    const newPost = new Post({
      title,
      content: sanitizedContent,
      excerpt,
      tags: tags.split(","), // Convert tags to array if necessary
      category: mongoose.Types.ObjectId(category),
      photo: photo ? photo.filename : undefined,
      author: req.user._id, // Set the author to the logged-in user's ID
      published: published === "true",
    });
    
    const post = await newPost.save();
    res.status(201).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
});

// THIS IS WHERE THE ROUTE FOR THE TOURS ARE HANDLED
// 5 related posts
router.route("/:id/related-posts").get(relatedPosts);

// 5 recent posts
router
  .route("/recent-posts")
  .get(postController.recentPosts, postController.getAllPosts);

router.route("/").get(postController.getAllPosts);
router
  .route("/:id")
  .get(postController.getPost)
  .patch(authController.protect, postController.updatePost)
  .delete(authController.protect, postController.deletePost);

module.exports = router;
