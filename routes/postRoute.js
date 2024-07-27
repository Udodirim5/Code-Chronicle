const express = require('express');
const multer = require('multer');
const authController = require('./../controllers/authController');
const postController = require("./../controllers/postController");
const relatedPosts = require("../middlewares/relatedPosts");

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/submit-post', upload.single('photo'), authController.protect, postController.submitPost);

router.route("/:id/related-posts").get(relatedPosts);

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
