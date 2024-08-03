const Item = require('./../models/itemModel');
const factory = require('./handlerFactory');

exports.getItem = factory.getOne(Item);
exports.getAllItems = factory.getAll(Item);
exports.updateItem = factory.updateOne(Item);
exports.deleteItem = factory.deleteOne(Item);
exports.createItems = factory.createOne(Item);
