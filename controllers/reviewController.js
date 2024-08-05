const Review = require('./../models/reviewModel');
const Purchase = require('./../models/purchaseModel');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.setReviewData = catchAsync(async (req, res, next) => {
  const { secret } = req.query;

  const purchase = await Purchase.findOne({ secret });

  if (!purchase) {
    return next(new AppError('Invalid or expired link.', 400));
  }

  req.body.item = purchase.item;
  req.body.name = purchase.buyerName;
  req.body.email = purchase.buyerEmail;
  next();
});

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
