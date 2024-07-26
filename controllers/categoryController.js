const Category = require("./../models/categoryModel");
const factory = require("./handlerFactory");

exports.getCategory = factory.getOne(Category);
exports.getAllCategories = factory.getAll(Category);
exports.updateCategory = factory.updateOne(Category);
exports.deleteCategory = factory.deleteOne(Category);
exports.createCategories = factory.createOne(Category);
