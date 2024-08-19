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
    default: Date.now,
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
  purchaseId: {
    type: String,
    unique: true,
  },
});

// Pre-save hook to generate a 6-digit purchase ID
purchaseSchema.pre("save", async function (next) {
  if (!this.purchaseId) {
    // Generate a 6-digit unique ID
    this.purchaseId = Math.floor(100000 + Math.random() * 900000).toString();

    // Ensure the generated ID is unique
    const existingPurchase = await mongoose.models.Purchase.findOne({
      purchaseId: this.purchaseId,
    });

    if (existingPurchase) {
      return next(new Error("Purchase ID collision, please try again."));
    }
  }
  next();
});

purchaseSchema.pre(/^find/, function (next) {
  this.populate({
    path: "item",
    select: "name description",
  });
  next();
});

const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;
