const Flutterwave = require('flutterwave-node-v3');
const factory = require('./handlerFactory');
const Purchase = require('../models/purchaseModel');
const Item = require('../models/itemModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const flw = new Flutterwave(
  process.env.FLUTTERWAVE_PUBLIC_KEY,
  process.env.FLUTTERWAVE_SECRET_KEY
);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently purchased item
  const item = await Item.findById(req.params.itemId);
  if (!item) {
    return next(new AppError('No item found with that ID', 404));
  }

  // 2) Create checkout session
  const session = await flw.PaymentLinks.create({
    title: `${item.name} Item`,
    description: item.summary,
    amount: item.price,
    currency: 'USD',
    redirect_url: `${req.protocol}://${req.get('host')}/my-item?alert=Purchase`,
    payment_options: 'card',
    customer: {
      email: req.body.email,
      name: req.body.name
    },
    customizations: {
      title: `${item.name} Purchase`,
      description: 'Payment for item purchase',
      logo: `${req.protocol}://${req.get('host')}/img/items/${item.imageCover}`
    }
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session
  });
});

const createPurchaseCheckout = async (eventData) => {
  const item = eventData.tx_ref;
  const buyerName = eventData.customer.name;
  const buyerEmail = eventData.customer.email;
  const price = eventData.amount;
  await Purchase.create({ item, buyerName, buyerEmail, price, paid: true });
};

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['verif-hash'];

  let eventData;
  try {
    eventData = req.body;
    if (!signature || signature !== process.env.FLUTTERWAVE_ENCRYPTION_KEY) {
      throw new Error('Invalid signature');
    }
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (eventData.event === 'charge.completed') {
    createPurchaseCheckout(eventData.data);
  }

  res.status(200).json({ received: true });
};

exports.getPurchase = factory.getOne(Purchase);
exports.getAllPurchases = factory.getAll(Purchase);
exports.updatePurchase = factory.updateOne(Purchase);
exports.deletePurchase = factory.deleteOne(Purchase);

exports.createPurchase = catchAsync(async (req, res, next) => {
  const { item, buyerName, buyerEmail, price } = req.body;

  // Ensure item exists
  const purchasedItem = await Item.findById(item);
  if (!purchasedItem) {
    return next(new AppError('No item found with that ID', 404));
  }

  const newPurchase = await Purchase.create({
    item,
    buyerName,
    buyerEmail,
    price,
    paid: true // Update based on actual payment status
  });

  res.status(201).json({
    status: 'success',
    data: {
      purchase: newPurchase
    }
  });
});
