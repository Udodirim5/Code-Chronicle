const Contact = require('./../models/contactModel');
const factory = require('./handlerFactory');

exports.getContact = factory.getOne(Contact);
exports.getAllContacts = factory.getAll(Contact);
exports.updateContact = factory.updateOne(Contact);
exports.deleteContact = factory.deleteOne(Contact);
exports.createContacts = factory.createOne(Contact);
