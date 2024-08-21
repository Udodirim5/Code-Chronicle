const multer = require("multer");
const sharp = require("sharp");
const Project = require("../models/projectModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Configure multer storage in memory
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
exports.uploadProjectImages = upload.fields([
  { name: "desktopImg", maxCount: 1 },
  { name: "mobileImg", maxCount: 1 },
]);

// RESIZE UPLOADED IMAGES
exports.resizeProjectImages = catchAsync(async (req, res, next) => {
  if (!req.files || (!req.files.desktopImg && !req.files.mobileImg)) {
    return next(
      new AppError("Both desktop and mobile images are required.", 400)
    );
  }

  // Initialize req.body to store filenames
  req.body.desktopImg = "";
  req.body.mobileImg = "";

  // Process desktop image
  try {
    if (req.files.desktopImg) {
      const desktopFilename = `project-${
        req.params.id
      }-${Date.now()}-desktopImg.jpeg`;
      await sharp(req.files.desktopImg[0].buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/uploads/projects/${desktopFilename}`);
      req.body.desktopImg = desktopFilename;
    }

    if (req.files.mobileImg) {
      const mobileFilename = `project-${
        req.params.id
      }-${Date.now()}-mobileImg.jpeg`;
      await sharp(req.files.mobileImg[0].buffer)
        .resize(1333, 2000)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/uploads/projects/${mobileFilename}`);
      req.body.mobileImg = mobileFilename;
    }
  } catch (error) {
    return next(
      new AppError("Error processing images. Please try again later.", 500)
    );
  }

  next();
});

exports.splitTech = catchAsync(async (req, res, next) => {
  // Check if technologies is a string and split it into an array
  if (typeof req.body.technologies === "string") {
    req.body.technologies = req.body.technologies
      .split(",")
      .map((tech) => tech.trim()); // Converts the string into an array
  }
  next();
});

exports.createProject = catchAsync(async (req, res, next) => {
  const newProject = await Project.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      project: newProject,
    },
  });
});

// CRUD operations using factory functions
exports.getProject = factory.getOne(Project);
exports.getAllProjects = factory.getAll(Project);
exports.updateProject = factory.updateOne(Project);
exports.deleteProject = factory.deleteOne(Project);
