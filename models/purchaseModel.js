const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.ObjectId,
    ref: "Item",
    required: [true, "Purchase must belong to an Item!"],
  },
  buyerName: {
    type: String,
    required: [true, "Purchase must have a buyer name."],
  },
  buyerEmail: {
    type: String,
    required: [true, "Purchase must have a buyer email."],
  },
  price: {
    type: Number,
    required: [true, "Purchase must have a price."],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: false,
  },
  secret: {
    type: String,
    required: true,
    unique: true,
  },
});

purchaseSchema.pre(/^find/, function(next) {
  this.populate({
    path: "item",
    select: "name",
  });
  next();
});

const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;
