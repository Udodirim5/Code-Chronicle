const crypto = require("crypto");
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const sendEmail = require("./../utils/email");
const Flutterwave = require("flutterwave-node-v3");
const Purchase = require("../models/purchaseModel");
const Item = require("../models/itemModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require('./handlerFactory');




const generateSecret = () => {
  return crypto.randomBytes(16).toString("hex");
};

const flw = new Flutterwave(
  process.env.FLUTTERWAVE_PUBLIC_KEY,
  process.env.FLUTTERWAVE_SECRET_KEY
);

exports.createPurchase = catchAsync(async (req, res, next) => {
  console.log("Received POST request to create purchase");
  console.log("Request body:", req.body);

  const { item, buyerName, buyerEmail, price } = req.body;

  // Ensure item exists
  const purchasedItem = await Item.findById(item);
  if (!purchasedItem) {
    console.error("No item found with that ID");
    return next(new AppError("No item found with that ID", 404));
  }

  const secret = generateSecret(); // Generate a unique secret
  console.log("Generated secret:", secret);

  try {
    const newPurchase = await Purchase.create({
      item,
      buyerName,
      buyerEmail,
      price,
      paid: true, // Update based on actual payment status
      secret, // Store the secret
    });

    console.log("Purchase created:", newPurchase);

    res.status(201).json({
      status: "success",
      data: {
        purchase: newPurchase,
      },
    });
  } catch (error) {
    console.error("Error creating purchase:", error);
    next(new AppError("Error creating purchase", 500));
  }
});

exports.webhookCheckout = (req, res, next) => {
  console.log("Webhook received");
  const signature = req.headers["verif-hash"];
  console.log("Signature:", signature);

  let eventData;
  try {
    eventData = req.body;
    if (!signature || signature !== process.env.FLUTTERWAVE_ENCRYPTION_KEY) {
      throw new Error("Invalid signature");
    }
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (eventData.event === "charge.completed") {
    createPurchaseCheckout(eventData.data);
  }

  res.status(200).json({ received: true });
};

const createPurchaseCheckout = catchAsync(async (eventData) => {
  console.log("Creating purchase from webhook data");
  console.log("Event data:", eventData);

  const item = eventData.tx_ref;
  const buyerName = eventData.customer.name;
  const buyerEmail = eventData.customer.email;
  const price = eventData.amount;
  await Purchase.create({
    item,
    buyerName,
    buyerEmail,
    price,
    paid: true,
  });
  console.log("Purchase created from webhook");
});

exports.getPurchase = factory.getOne(Purchase, { path: "item" });
exports.getAllPurchases = factory.getAll(Purchase, { path: "item" });
exports.deletePurchase = factory.deleteOne(Purchase);


