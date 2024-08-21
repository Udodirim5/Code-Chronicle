const multer = require("multer");
const path = require("path");
const catchAsync = require("../utils/catchAsync");
const Item = require("../models/itemModel");
const factory = require("./handlerFactory");

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype === "application/zip") {
      cb(null, "public/uploads/zips");
    } else if (file.mimetype.startsWith("image")) {
      cb(null, "public/uploads/items");
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

// Multer filter for file types
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/zip" ||
    file.mimetype.startsWith("image/")
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only images and zip files are allowed."),
      false
    );
  }
};

// Upload configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB limit
});

// Middleware for uploading files
const uploadFiles = upload.fields([
  { name: "itemImage", maxCount: 1 },
  { name: "itemZipFile", maxCount: 1 },
]);

exports.createItem = [
  uploadFiles,
  catchAsync(async (req, res, next) => {
    const { name, description, price } = req.body;
    const itemImage = req.files["itemImage"]
      ? req.files["itemImage"][0].path
      : null;
    const itemZipFile = req.files["itemZipFile"]
      ? req.files["itemZipFile"][0].path
      : null;

    if (!itemImage || !itemZipFile) {
      return next(new Error("File upload failed"));
    }

    const newItem = await Item.create({
      name,
      description,
      price,
      itemImage,
      itemZipFile,
      createdBy: req.user._id,
    });

    res.status(201).json({
      status: "success",
      data: {
        item: newItem,
      },
    });
  }),
];

exports.getItem = factory.getOne(Item, { path: "reviews" });
exports.getAllItems = factory.getAll(Item);
exports.updateItem = factory.updateOne(Item);
exports.deleteItem = factory.deleteOne(Item);
// exports.createItem = factory.createOne(Item);

exports.getItemStats = catchAsync(async (req, res, next) => {
  const stats = await Item.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numItems: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});
