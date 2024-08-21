const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const sendEmail = require("./../utils/email");
const Flutterwave = require("flutterwave-node-v3");
const Purchase = require("../models/purchaseModel");
const Item = require("../models/itemModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const Token = require("../models/tokenModel");

const generateSecret = () => {
  return crypto.randomBytes(16).toString("hex");
};

const flw = new Flutterwave(
  process.env.FLUTTERWAVE_PUBLIC_KEY,
  process.env.FLUTTERWAVE_SECRET_KEY
);

exports.createPurchase = catchAsync(async (req, res, next) => {
  const { item, buyerName, buyerEmail, price } = req.body;

  // Ensure the item exists
  const purchasedItem = await Item.findById(item);
  if (!purchasedItem) {
    return next(new AppError("No item found with that ID", 404));
  }

  // Generate a unique secret (ensure this function is properly defined)
  const secret = generateSecret();

  try {
    const newPurchase = await Purchase.create({
      item,
      buyerName,
      buyerEmail: buyerEmail.toLowerCase(), // Store email in lowercase for consistency
      price,
      paid: true, // Update based on actual payment status
      secret, // Store the secret
    });

    res.status(201).json({
      status: "success",
      data: {
        purchase: newPurchase,
        item: newPurchase.item,
        purchaseId: newPurchase._id, // Use _id as purchaseId
        buyerEmail: newPurchase.buyerEmail,
      },
    });
  } catch (error) {
    next(new AppError("Error creating purchase: " + error.message, 500));
  }
});

exports.webhookCheckout = (req, res, next) => {
  // Access the correct header
  const signature = req.headers["verif-hash"] || req.headers["Verif-Hash"];

  let eventData;
  try {
    eventData = req.body;
    if (!signature || signature !== process.env.FLUTTERWAVE_SECRET_HASH) {
      throw new Error("Invalid signature");
    }
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (eventData.event === "charge.completed") {
    createPurchaseCheckout(eventData.data);
  }

  res.status(200).json({ received: true });
};

const createPurchaseCheckout = catchAsync(async (eventData) => {
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
});

// Controller for verifying email and generating token
exports.verifyEmail = catchAsync(async (req, res, next) => {
  const { email, itemId } = req.body;

  if (!email || !itemId) {
    return next(new AppError("Please provide both email and item ID.", 400));
  }

  const purchase = await Purchase.findOne({ buyerEmail: email, item: itemId });

  if (!purchase) {
    return next(
      new AppError("No purchase found with that email for this item.", 404)
    );
  }

  const token = crypto.randomBytes(32).toString("hex");

  const tokenDoc = await Token.create({
    token,
    purchase: purchase._id,
    email: purchase.buyerEmail,
    expiresAt: Date.now() + 60 * 60 * 1000, // Token expires in 1 hour
  });

  // Attach the token to the request object so the next middleware can access it
  req.body.token = tokenDoc.token;

  // Move to the next middleware (verifyToken)
  next();
});

// Controller for verifying the token
exports.verifyToken = catchAsync(async (req, res, next) => {
  const { token } = req.token || req.body;

  if (!token) {
    return next(new AppError("Token is missing.", 400));
  }

  const tokenDoc = await Token.findOne({ token, used: false });

  if (!tokenDoc || tokenDoc.expiresAt < Date.now()) {
    return next(new AppError("Invalid or expired token.", 400));
  }

  await tokenDoc.save();

  // Send the response
  res.status(200).json({
    status: "success",
    data: {
      token: tokenDoc.token,
    },
  });
});

exports.getPurchase = factory.getOne(Purchase, { path: "item" });
exports.getAllPurchases = factory.getAll(Purchase, { path: "item" });
exports.deletePurchase = factory.deleteOne(Purchase);

exports.purchaseId = catchAsync(async (req, res, next) => {
  const { buyerEmail, itemId } = req.body;

  // Ensure both buyerEmail and itemId are provided
  if (!buyerEmail || !itemId) {
    return next(new AppError("Buyer email and item ID are required.", 400));
  }

  const purchase = await Purchase.findOne({
    buyerEmail: buyerEmail.toLowerCase(),
    item: itemId,
  });

  if (!purchase) {
    return next(new AppError("Purchase not found.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      purchaseId: purchase.purchaseId,
    },
  });
});
