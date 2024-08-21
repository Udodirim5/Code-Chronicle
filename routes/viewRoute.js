const express = require("express");
const relatedPosts = require("./../middlewares/relatedPosts");
const authController = require("../controllers/authController");
const viewController = require("./../controllers/viewController");

const router = express.Router();

router.get("/posts/:id/related", relatedPosts);

router.get("/login", viewController.getLoginForm);
router.get("/signup", viewController.getSignUpForm);
router.get("/forget-password", viewController.getForgetPasswordForm);

router.use(authController.isLoggedIn);

// Client routes
router.get("/", viewController.getHomePage);
router.get("/blog", viewController.getPosts);
router.get("/blog/:slug", viewController.getPost);
router.get("/contact", viewController.getContact);
router.get("/about", viewController.getAboutPage);
router.get("/projects", viewController.getProjects);
router.get("/market-place/:slug", viewController.getItem);
router.get("/market-place", viewController.getMarketPlace);
router.get("/payment-success/:token", viewController.paidGetItem);
router.get("/redirect/:purchaseId/:item/:buyerEmail", viewController.paidRedirect);

// Admin- side routes
router.get("/admin/profile", viewController.admin);
router.get("/express-admin", viewController.userDashboard);
router.get("/admin/admin-posts", viewController.getAdminPost);
router.get("/admin/edit-post/:id", viewController.getEditPost);
router.get("/admin/create-item", viewController.getCreateItemForm);
router.get("/admin/create-post", viewController.getCreatePostForm);

// Admin Only
// router.use(authController.restrictTo('admin'));

router.get("/admin/all-users", viewController.userProfile);
router.get("/admin/myWork", viewController.getAdminProject);
router.get("/admin/messages", viewController.getAdminMessages);
router.get('/projects/edit/:id', viewController.getEditProjectForm);
router.get("/admin/create-project", viewController.getCreateProjectForm);


module.exports = router;
