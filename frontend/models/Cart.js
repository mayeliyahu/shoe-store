const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            shoe: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Shoe',
                required: true
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ]
});

module.exports = mongoose.model('Cart', cartSchema);
