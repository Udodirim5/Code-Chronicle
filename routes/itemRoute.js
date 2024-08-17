const express = require('express');

const ItemController = require('../controllers/itemController');

const router = express.Router();

router.route('/item-stats').get(ItemController.getItemStats);

router
  .route('/')
  .get(ItemController.getAllItems)
  .post(ItemController.createItem);
router
  .route('/:id')
  .get(ItemController.getItem)
  .patch(ItemController.updateItem)
  .delete(ItemController.deleteItem);

module.exports = router;
