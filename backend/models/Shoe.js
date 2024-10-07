const mongoose = require("mongoose");

const shoeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  availableSizes: {
    type: [Number],
    required: true,
  },
  inStockSizes: {
    type: [Number],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  gender: {
    type: String, //"Men", "Women", or "Unisex"
    required: true,
  },
  salePrice: {
    type: Number,
    default: null, // Optional sale price
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Shoe", shoeSchema);
