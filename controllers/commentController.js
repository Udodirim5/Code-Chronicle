const Comment = require('./../models/commentModel');
const factory = require('./handlerFactory');

exports.getComment = factory.getOne(Comment, { path: "post" });
exports.getAllComments = factory.getAll(Comment, { path: "post" });
exports.updateComment = factory.updateOne(Comment);
exports.deleteComment = factory.deleteOne(Comment);
exports.createComments = factory.createOne(Comment);
