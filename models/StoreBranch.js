const mongoose = require('mongoose');

const storeBranchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null //optional
    },
    contactNumber: {
        type: String,
        required: true
    },
    openingHours: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('StoreBranch', storeBranchSchema);
