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
  console.log('body:', req.body); // Debugging log
  console.log('Files:', req.files); // Debugging log
  console.log('desktopImg:', req.files.desktopImg);
  console.log('mobileImg:', req.files.mobileImg);
  
  if (!req.files || (!req.files.desktopImg && !req.files.mobileImg)) {
    return next(
      new AppError("Both desktop and mobile images are required.", 400)
    );
  }

  // Initialize req.body to store filenames
  req.body.desktopImg = "";
  req.body.mobileImg = "";

  // Process desktop image
  if (req.files.desktopImg) {
    const desktopFilename = `project-${req.params.id}-${Date.now()}-desktopImg.jpeg`;
    await sharp(req.files.desktopImg[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/img/projects/${desktopFilename}`);
    req.body.desktopImg = desktopFilename;
  }

  // Process mobile image
  if (req.files.mobileImg) {
    const mobileFilename = `project-${req.params.id}-${Date.now()}-mobileImg.jpeg`;
    await sharp(req.files.mobileImg[0].buffer)
      .resize(1333, 2000)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/img/projects/${mobileFilename}`);
    req.body.mobileImg = mobileFilename;
  }

  next();
});

// CRUD operations using factory functions
exports.createProject = factory.createOne(Project);
exports.getProject = factory.getOne(Project);
exports.getAllProjects = factory.getAll(Project);
exports.updateProject = factory.updateOne(Project);
exports.deleteProject = factory.deleteOne(Project);
