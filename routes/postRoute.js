const express = require("express");
const authController = require("./../controllers/authController");
const postController = require("./../controllers/postController");
// const relatedPosts = require("../middlewares/relatedPosts");

const router = express.Router();

router.post(
  "/submit-post",
  authController.protect,
  postController.uploadPostImages,
  postController.resizePostImages,
  postController.submitPost
);

// router.route("/:id/related-posts").get(relatedPosts);

router
  .route("/recent-posts")
  .get(postController.recentPosts, postController.getAllPosts);

router.route("/").get(postController.getAllPosts);
router
  .route("/:id")
  .patch(
    authController.protect,
    postController.uploadPostImages,
    postController.resizePostImages,
    postController.updatePostWithPhoto
  )
  .get(
    postController.relatePosts,
    postController.popularPosts,
    postController.incPost,
    postController.getPost
  )
  .delete(authController.protect, postController.deletePost);

module.exports = router;
