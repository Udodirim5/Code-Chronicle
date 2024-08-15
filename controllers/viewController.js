const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Post = require("./../models/postModel");
const Project = require("./../models/projectModel");
const Social = require("./../models/socialModel");
const Contact = require("./../models/contactModel");
const Category = require("./../models/categoryModel");
const Comment = require("./../models/commentModel");
const Purchase = require("./../models/purchaseModel");
const User = require("./../models/userModel");
const Item = require("./../models/itemModel");
const Flutterwave = require("flutterwave-node-v3");
const Review = require("./../models/reviewModel");

const flw = new Flutterwave(
  process.env.FLUTTERWAVE_PUBLIC_KEY,
  process.env.FLUTTERWAVE_SECRET_KEY
);

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
  const users = await User.find();
  res.render("users", {
    title: "All users",
    users,
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  // Fetch the post by slug, along with comments and category
  const post = await Post.findOne({ slug: req.params.slug }).populate(
    "comments category"
  );

  if (!post) {
    return next(new AppError("There is no post with that name.", 404));
  }

  // Fetch related posts with matching category, excluding the current post
  const relatedPosts = await Post.find({
    category: { $in: post.category },
    _id: { $ne: post._id },
  })
    .limit(5)
    .select("title slug");

  // Fetch recent posts (limited to 3 and sorted by creation date)
  const recentPosts = await Post.find()
    .sort("-createdAt")
    .limit(3)
    .select("title slug photo createdAt");

  res.status(200).render("blog-single", {
    title: `${post.name} Post`,
    post,
    category: post.category,
    comments: post.comments, // Pass comments to the view
    relatedPosts, // Pass related posts to the view
    popularPosts: req.popularPosts, // Pass popular posts to the view
    recentPosts, // Pass recent posts to the view
  });

  // Log the values for debugging
  console.log("relatedPosts", relatedPosts);
  console.log(req.popularPosts);
});

exports.getLoginForm = (req, res) => {
  res.status(200).render("login", {
    title: "Log In",
  });
};
exports.getForgetPasswordForm = (req, res) => {
  res.status(200).render("forgetPassword", {
    title: "Forget Password",
  });
};

exports.getSignUpForm = (req, res) => {
  res.status(200).render("signUp", {
    title: "Sign up",
  });
};

exports.admin = catchAsync(async (req, res) => {
  const social = await Social.findOne(); // Assuming there's only one set of social links
  res.render("admin-profile", {
    title: "Admin Profile",
    social, // Passing the single social object to the template
  });
});
exports.userDashboard = (req, res) => {
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

exports.getMarketPlace = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Item.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const items = await features.query;

  const totalItems = await Item.countDocuments();
  const limit = req.query.limit * 1 || 12;
  const page = req.query.page * 1 || 1;
  const pages = Math.ceil(totalItems / limit);

  res.status(200).render("market-place", {
    title: "Market Place",
    items,
    currentPage: page,
    totalPages: pages,
  });
});

exports.getItem = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested items (including reviews and guides)
  const item = await Item.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });
  const user = await User.findOne();

  if (!item) {
    return next(new AppError("There is no item with that name.", 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render("market-single", {
    title: `${item.name} Item`,
    item,
    user,
  });
});

exports.paidGetItem = catchAsync(async (req, res, next) => {
  const purchase = await Purchase.findOne({
    purchaseId: req.params.purchaseId,
  });

  if (!purchase) {
    return next(new AppError("No purchase found with that ID", 404));
  }

  // Check if a review already exists for this item and email
  const existingReview = await Review.findOne({
    item: purchase.item._id,
    email: purchase.buyerEmail,
  });

  res.status(200).render("paid-get-item", {
    title: "Download Item",
    purchase,
    // existingReview,
    reviewExists: !!existingReview, // Boolean to indicate if a review exists
  });
});

// exports.paidGetItem = catchAsync(async (req, res) => {
//   // const purchase = await Purchase.findOne({ secret: req.params.secret });
//   const purchase = await Purchase.find();
//   console.log(req.params.secret);

//   if (!purchase) {
//     return next(new AppError("No purchase found with that ID", 404));
//   }

//   // const txRef = req.query.tx_ref;

//   // // try {
//   //   // Manually verify the transaction using Axios
//   //   const response = await axios.get(
//   //     `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${txRef}`,
//   //     {
//   //       headers: {
//   //         Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
//   //       },
//   //     }
//   //   );

//   //   const transaction = response.data.data;

//   //   if (transaction.status !== "successful") {
//   //     return res.status(400).json({
//   //       status: "fail",
//   //       message: "Payment not successful",
//   //     });
//   //   }

//   //   // Assuming the transaction response contains an item_id, adjust as needed
//   //   const itemId = transaction.meta.item_id;
//   //   const item = await Item.findById(itemId);

//   //   // if (!item) {
//   //   //   return res.status(404).json({
//   //   //     status: "fail",
//   //   //     message: "Item not found",
//   //   //   });
//   //   // }

//   res.status(200).render("paid-get-item", {
//     title: "paid-get-item",
//     // transaction,
//     purchase,
//     // item,
//   });
//   // } catch (error) {
//   //   console.error("Verification error:", error);
//   //   res.status(500).json({
//   //     status: "error",
//   //     message: "Server error while verifying transaction",
//   //   });
//   // }
// });
