const express = require('express');
const authController = require('../controllers/authController');
const viewController = require('./../controllers/viewController');
const relatedPosts = require('./../middlewares/relatedPosts');

const router = express.Router();

router.get('/posts/:id/related', relatedPosts);

router.get('/login', viewController.getLoginForm);
router.get('/signup', viewController.getSignUpForm);
router.get('/forget-password', viewController.getForgetPasswordForm);

router.use(authController.isLoggedIn);

// Client routes
router.get('/', viewController.getHomePage);
router.get('/blog', viewController.getPosts);
router.get('/blog/:slug', viewController.getPost);
router.get('/contact', viewController.getContact);
router.get('/about', viewController.getAboutPage);
router.get('/projects', viewController.getProjects);

// Admin routes
router.get('/express-admin', viewController.userDashboard);
router.get('/admin/profile', viewController.admin);
router.get('/admin/create-post', viewController.getCreatePostForm);
router.get('/admin/edit-post/:id', viewController.getEditPost);
router.get('/admin/create-project', viewController.getCreateProjectForm);
router.get('/admin/admin-posts', viewController.getAdminPost);
router.get('/admin/myWork', viewController.getAdminProject);
router.get('/admin/messages', viewController.getAdminMessages);
router.get('/admin/all-users', viewController.userProfile);

module.exports = router;
