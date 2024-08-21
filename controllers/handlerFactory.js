const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "created",
      data: { data: doc },
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    // Apply populate options if provided
    if (populateOptions) {
      if (Array.isArray(populateOptions)) {
        // If it's an array, use forEach to apply each populate option
        populateOptions.forEach((option) => {
          query = query.populate(option);
        });
      } else {
        // If it's a single object or string, apply populate directly
        query = query.populate(populateOptions);
      }
    }
    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET review on tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Apply populate options if provided
    if (populateOptions) {
      if (Array.isArray(populateOptions)) {
        // If it's an array, use forEach to apply each populate option
        populateOptions.forEach((option) => {
          features.query = features.query.populate(option);
        });
      } else {
        // If it's a single object or string, apply populate directly
        features.query = features.query.populate(populateOptions);
      }
    }

    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      requestedAt: req.requestTime,
      status: "success",
      results: doc.length,
      data: { data: doc },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: { data: doc },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.viewsCounter = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      return res
        .status(404)
        .json({ status: "fail", message: "Post not found" });
    }

    await doc.incrementViews();

    req.doc = doc;
    next();
  });
