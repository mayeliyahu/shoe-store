const mongoose = require('mongoose');

const shoeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    availableSizes: {
        type: [Number],
        required: true
    },
    inStockSizes: {
        type: [Number],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    inStock: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Shoe', shoeSchema);
