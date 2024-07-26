const express = require('express');

const socialController = require('../controllers/socialController');

const router = express.Router();

// THIS IS WHERE THE ROUTE FOR THE SOCIAL ARE HANDLED
router
  .route('/')
  .get(socialController.getAllSocials)
  .post(socialController.createSocial);
router
  .route('/:id')
  .get(socialController.getSocial)
  .patch(socialController.updateSocial)
  .delete(socialController.deleteSocial);

module.exports = router;
