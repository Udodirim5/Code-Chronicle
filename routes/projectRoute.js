const express = require('express');

const projectController = require('../controllers/projectController');

const router = express.Router();

// THIS IS WHERE THE ROUTE FOR THE PROJECTS ARE HANDLED
router
  .route('/')
  .get(projectController.getAllProjects)
  .post(projectController.createProjects);
router
  .route('/:id')
  .get(projectController.getProject)
  .patch(projectController.updateProject)
  .delete(projectController.deleteProject);

module.exports = router;
