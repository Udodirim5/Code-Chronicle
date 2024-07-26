const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Post = require("./../models/postModel");
const Project = require("./../models/projectModel");
const Social = require("./../models/socialModel");
const Contact = require("./../models/contactModel");
const Category = require("./../models/categoryModel");
const Comment = require("./../models/commentModel");
const User = require("./../models/userModel");

exports.getContact = catchAsync(async (req, res) => {
  const socialLinks = await Social.findOne({});
  res.render("contact", {
    title: "contact",
    socialLinks,
  });
});

exports.getAdminMessages = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Contact.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const contacts = await features.query;

  const totalContacts = await Contact.countDocuments();
  const limit = req.query.limit * 1 || 12;
  const page = req.query.page * 1 || 1;
  const pages = Math.ceil(totalContacts / limit);

  res.render("messages", {
    title: "Messages",
    contacts,
    page,
    pages,
  });
});

exports.getProjects = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Project.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const projects = await features.query;

  const totalProjects = await Project.countDocuments();
  const limit = req.query.limit * 1 || 12;
  const page = req.query.page * 1 || 1;
  const pages = Math.ceil(totalProjects / limit);

  res.render("projects", {
    title: "My Works",
    projects,
    page,
    pages,
  });
});

exports.getAdminProject = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Project.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const projects = await features.query;

  const totalProjects = await Project.countDocuments();
  const limit = req.query.limit * 1 || 12;
  const page = req.query.page * 1 || 1;
  const pages = Math.ceil(totalProjects / limit);

  res.render("myWork", {
    title: "My Works",
    projects,
    page,
    pages,
  });
});

exports.getAdminPost = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Post.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const posts = await features.query;

  const totalPosts = await Post.countDocuments();
  const limit = req.query.limit * 1 || 12;
  const page = req.query.page * 1 || 1;
  const pages = Math.ceil(totalPosts / limit);

  res.render("admin-posts", {
    title: "Admin Posts",
    posts,
    page,
    pages,
  });
});

exports.getPosts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Post.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const posts = await features.query;

  const totalPosts = await Post.countDocuments();
  const limit = req.query.limit * 1 || 12;
  const page = req.query.page * 1 || 1;
  const pages = Math.ceil(totalPosts / limit);

  res.render("blog", {
    title: "Blog Page",
    posts,
    page,
    pages,
  });
});

exports.userProfile = catchAsync(async (req, res, next) => {
  const user = res.locals.user;
  res.render("admin-users", {
    title: "Admin Dashboard",
    user,
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({ slug: req.params.slug });
  const user = await User.findOne();
  const category = await Category.findOne();
  const comment = await Comment.findOne();

  if (!post) {
    return next(new AppError("There is no post with that name.", 404));
  }

  res.status(200).render("blog-single", {
    title: `${post.name} Post`,
    post,
    user,
    category,
    comment,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render("login", {
    title: "Log In",
  });
};

exports.getSignUpForm = (req, res) => {
  res.status(200).render("signUp", {
    title: "Sign up",
  });
};

exports.admin = (req, res) => {
  res.render("admin-profile", {
    title: "Admin Profile",
  });
};

exports.userProfile = (req, res) => {
  res.render("admin-dashboard", {
    title: "Admin Dashboard",
  });
};

exports.getEditPost = catchAsync(async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findById(postId);
  const categories = await Category.find();

  if (!post) {
    return next(new AppError("No post found with that ID", 404));
  }

  res.status(200).render("editPost", {
    title: `Edit Post - ${post.title}`,
    post,
    categories,
  });
});

exports.getCreatePostForm = catchAsync(async (req, res) => {
  const categories = await Category.find();
  res.status(200).render("createPost", {
    title: "Create New Post",
    categories,
  });
});

exports.getCreateProjectForm = catchAsync(async (req, res) => {
  res.status(200).render("createProject", {
    title: "Create New Project",
  });
});

exports.getAboutPage = catchAsync(async (req, res) => {
  const user = await User.find();
  res.status(200).render("about", {
    title: "About Me",
    user,
  });
});

exports.getHomePage = (req, res) => {
  const user = res.locals.user;
  res.status(200).render("home", {
    title: "Home Page",
    user,
  });
};
