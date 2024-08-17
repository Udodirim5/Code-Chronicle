const express = require("express");
const purchaseController = require("../controllers/purchaseController");

const router = express.Router();

router.post("/create-purchase", purchaseController.createPurchase);
router.post("/webhook", purchaseController.webhookCheckout);
router.get('/purchase-id', purchaseController.purchaseId);

router.post(
  "/verify-email",
  purchaseController.verifyEmail,
  purchaseController.verifyToken
);

router.route("/").get(purchaseController.getAllPurchases);

router
  .route("/:id")
  .get(purchaseController.getPurchase)
  // .patch(purchaseController.updatePurchase)
  .delete(purchaseController.deletePurchase);

module.exports = router;
