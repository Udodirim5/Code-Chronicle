const Logo = require('./../models/logoModel');
const factory = require('./handlerFactory');

exports.getLogo = factory.getOne(Logo);
exports.getAllLogos = factory.getAll(Logo);
exports.updateLogo = factory.updateOne(Logo);
exports.deleteLogo = factory.deleteOne(Logo);
exports.createLogos = factory.createOne(Logo);
