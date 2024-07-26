const Social = require('./../models/socialModel');
const factory = require('./handlerFactory');

exports.getSocial = factory.getOne(Social);
exports.getAllSocials = factory.getAll(Social);
exports.updateSocial = factory.updateOne(Social);
exports.deleteSocial = factory.deleteOne(Social);
exports.createSocial = factory.createOne(Social);
