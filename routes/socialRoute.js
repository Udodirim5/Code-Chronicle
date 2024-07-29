const express = require("express");

const socialController = require("../controllers/socialController");
const authController = require("../controllers/authController");

const router = express.Router();

router.patch(
  "/update-socials",
  authController.protect,
  socialController.updateSocials
);

router
  .route("/")
  .get(socialController.getAllSocials)
  .post(socialController.createSocial);
router
  .route("/:id")
  .get(socialController.getSocial)
  .delete(socialController.deleteSocial);

module.exports = router;
