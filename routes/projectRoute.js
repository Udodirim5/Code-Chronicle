const express = require('express');
const projectController = require('../controllers/projectController');

const router = express.Router();


// Routes for handling other project-related requests
router
  .route('/')
  .get(projectController.getAllProjects)
  .post(
    projectController.uploadProjectImages,
    projectController.createProject  
  );

router
  .route('/:id')
  .get(projectController.getProject)
  .patch(projectController.updateProject)
  .delete(projectController.deleteProject);

module.exports = router;