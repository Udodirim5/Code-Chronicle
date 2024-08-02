const mongoose = require("mongoose");
const Category = require("./../models/categoryModel");
const sanitizeHtml = require("sanitize-html");
const catchAsync = require("./../utils/catchAsync");
const Post = require("./../models/postModel");
const factory = require("./handlerFactory");
const multer = require("multer");
const sharp = require("sharp");
const AppError = require("./../utils/appError");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// UPLOAD MULTIPLE IMAGES
exports.uploadPostImages = upload.fields([
  { name: "images", maxCount: 8 },
  { name: "photo", maxCount: 1 },
]);

// RESIZE UPLOADED IMAGES
exports.resizePostImages = catchAsync(async (req, res, next) => {
  if (!req.files.photo && !req.files.images) return next();

  // Process cover image
  if (req.files.photo) {
    req.body.photo = `post-${req.params.id}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.photo[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/img/blogs/${req.body.photo}`);
  }

  // Process other images
  if (req.files.images) {
    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `post-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`public/img/posts/${filename}`);

        req.body.images.push(filename);
      })
    );
  }

  next();
});

exports.recentPosts = (req, res, next) => {
  req.query.limit = "6";
  req.query.sort = "-createdAt";
  req.query.fields = "title,excerpt,createdAt";
  next();
};

exports.getPost = factory.getOne(Post, { path: "author" });
exports.getAllPosts = factory.getAll(Post, { path: "author" });
exports.deletePost = factory.deleteOne(Post);

// Sanitize and validate post data for creating a new post
exports.submitPost = catchAsync(async (req, res, next) => {
  const sanitizedContent = sanitizeHtml(req.body.content, {
    allowedTags: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "ul",
      "li",
      "img",
      "a",
      "pre",
      "code",
    ],
    allowedAttributes: {
      a: ["href", "name", "target"],
      img: ["src"],
    },
  });

  const { title, excerpt, tags, category, published } = req.body;

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

  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    return res.status(400).json({
      status: "fail",
      message: "Category does not exist",
    });
  }

  const newPost = new Post({
    title,
    content: sanitizedContent,
    excerpt,
    tags: tags ? tags.split(",") : [],
    category: mongoose.Types.ObjectId(category),
    photo: req.body.photo,
    images: req.body.images,
    author: req.user._id,
    published: published === "true",
  });

  const post = await newPost.save();
  res.status(201).json({
    status: "success",
    data: {
      post,
    },
  });
});

// Update post with photo upload handling
exports.updatePostWithPhoto = catchAsync(async (req, res, next) => {
  const sanitizedContent = sanitizeHtml(req.body.content, {
    allowedTags: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "ul",
      "li",
      "img",
      "a",
      "pre",
      "code",
    ],
    allowedAttributes: {
      a: ["href", "name", "target"],
      img: ["src"],
    },
  });

  const { title, excerpt, tags, category, published } = req.body;

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

  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    return res.status(400).json({
      status: "fail",
      message: "Category does not exist",
    });
  }

  const updateData = {
    title,
    content: sanitizedContent,
    excerpt,
    tags: tags ? tags.split(",") : [],
    category: mongoose.Types.ObjectId(category),
    published: published === "true",
  };

  if (req.body.photo) {
    updateData.photo = req.body.photo;
  }

  if (req.body.images) {
    updateData.images = req.body.images;
  }

  const post = await Post.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!post) {
    return next(new AppError("No post found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
});











// // // Like a post
// // // router.post('/posts/:id/like', authController.protect, async (req, res) => {
// // //   const post = await Post.findById(req.params.id);
// // //   if (!post) {
// // //     return res.status(404).json({ status: "fail", message: "Post not found" });
// // //   }

// // //   await post.addLike(req.user._id); // Add like
// // //   res.status(200).json({ status: "success", message: "Post liked" });
// // // });

// // // // Dislike a post
// // // router.post('/posts/:id/dislike', authController.protect, async (req, res) => {
// // //   const post = await Post.findById(req.params.id);
// // //   if (!post) {
// // //     return res.status(404).json({ status: "fail", message: "Post not found" });
// // //   }

// // //   await post.addDislike(req.user._id); // Add dislike
// // //   res.status(200).json({ status: "success", message: "Post disliked" });
// // // });
