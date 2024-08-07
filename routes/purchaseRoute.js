const express = require('express');
const purchaseController = require('../controllers/purchaseController');

const router = express.Router();

router.post('/create-purchase', purchaseController.createPurchase);
router.post('/webhook', purchaseController.webhookCheckout);

module.exports = router;











// const express = require("express");
// const purchaseController = require("../controllers/purchaseController");
// const authController = require("./../controllers/authController");

// const router = express.Router();

// router.post("/checkout-session/:itemId", purchaseController.getCheckoutSession);
// router.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   purchaseController.webhookCheckout
// );

// router.use(authController.protect);

// router.use(authController.restrictTo("admin"));

// router
//   .route("/")
//   .get(purchaseController.getAllPurchases)
//   .post(purchaseController.createPurchase);

// router
//   .route("/:id")
//   .get(purchaseController.getPurchase)
//   .patch(purchaseController.updatePurchase)
//   .delete(purchaseController.deletePurchase);

// module.exports = router;
