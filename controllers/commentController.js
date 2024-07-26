const Comment = require('./../models/commentModel');
const factory = require('./handlerFactory');

exports.getComment = factory.getOne(Comment);
exports.getAllComments = factory.getAll(Comment);
exports.updateComment = factory.updateOne(Comment);
exports.deleteComment = factory.deleteOne(Comment);
exports.createComments = factory.createOne(Comment);
