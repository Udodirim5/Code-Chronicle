// const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const Item = require('./../models/itemModel');
const factory = require('./handlerFactory');

exports.getItem = factory.getOne(Item, {path: "reviews"});
exports.getAllItems = factory.getAll(Item);
exports.updateItem = factory.updateOne(Item);
exports.deleteItem = factory.deleteOne(Item);
exports.createItem = factory.createOne(Item);

exports.getItemStats = catchAsync(async (req, res, next) => {
  const stats = await Item.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numItems: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});
