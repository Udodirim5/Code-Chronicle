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

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    // await doc.incrementViews(); // Increment views

    res.status(200).json({
      status: "success",
      data: { data: doc },
    });
  });

// FIXME: TRY LOOKING IN THE REASON WHY THE ROLE FILTERING IS NOT WORKING AS INTENDED
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET review on tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;
    // const doc = await features.query.explain();

    // SENT RESPONSE
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

// exports.getAllPages = (Model, viewName) =>
//   catchAsync(async (req, res, next) => {
//     // 1) Get Data From The Collection
//     const docs = await Model.find();

//     // 2) Render The View Using Pug
//     res.render(viewName, {
//       title: viewName.charAt(0).toUpperCase() + viewName.slice(1),
//       data: docs
//     });
//   });
