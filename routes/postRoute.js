const express = require("express");
const authController = require("./../controllers/authController");
const postController = require("./../controllers/postController");
const relatedPosts = require("../middlewares/relatedPosts");

const router = express.Router();

router.post(
  "/submit-post",
  authController.protect,
  postController.uploadPostPhoto,
  postController.resizePostPhoto,
  postController.submitPost
);

router.patch(
  "/update-post/:id",
  authController.protect,
  postController.uploadPostPhoto,
  postController.resizePostPhoto,
  postController.updatePostWithPhoto
);

router.route("/:id/related-posts").get(relatedPosts);

router
  .route("/recent-posts")
  .get(postController.recentPosts, postController.getAllPosts);

router.route("/").get(postController.getAllPosts);
router
  .route("/:id")
  .get(postController.getPost)
  .delete(authController.protect, postController.deletePost);

module.exports = router;
