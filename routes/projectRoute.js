const express = require("express");
const projectController = require("../controllers/projectController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(projectController.getAllProjects)
  .post(
    authController.protect,
    projectController.uploadProjectImages,
    projectController.resizeProjectImages,
    projectController.createProject
  );

router
  .route("/:id")
  .get(projectController.getProject)
  .patch(
    authController.protect,
    projectController.uploadProjectImages,
    projectController.resizeProjectImages,
    projectController.updateProject
  )
  .delete(projectController.deleteProject);

module.exports = router;
