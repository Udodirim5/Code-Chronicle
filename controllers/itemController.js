// const AppError = require("./../utils/appError");
// const catchAsync = require("./../utils/catchAsync");
const Item = require('./../models/itemModel');
const factory = require('./handlerFactory');

// exports.getItem = factory.getOne(Item);
exports.getItem = factory.getOne(Item, {path: "reviews"});
exports.getAllItems = factory.getAll(Item);
exports.updateItem = factory.updateOne(Item);
exports.deleteItem = factory.deleteOne(Item);
exports.createItem = factory.createOne(Item);
