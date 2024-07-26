const express = require('express');

const logoController = require('../controllers/logoController');

const router = express.Router();

// THIS IS WHERE THE ROUTE FOR THE LOGO ARE HANDLED
router
  .route('/')
  .get(logoController.getAllLogos)
  .post(logoController.createLogos);
router
  .route('/:id')
  .get(logoController.getLogo)
  .patch(logoController.updateLogo)
  .delete(logoController.deleteLogo);

module.exports = router;
