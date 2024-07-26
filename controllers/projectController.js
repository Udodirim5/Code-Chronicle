const Project = require('./../models/projectModel');
const factory = require('./handlerFactory');

exports.getProject = factory.getOne(Project);
exports.getAllProjects = factory.getAll(Project);
exports.updateProject = factory.updateOne(Project);
exports.deleteProject = factory.deleteOne(Project);
exports.createProjects = factory.createOne(Project);
