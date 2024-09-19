const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.params.userId }).populate('items.shoe');
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addToCart = async (req, res) => {
    const { userId, shoeId, quantity } = req.body;
    try {
        const cart = await Cart.findOne({ user: userId });
        if (cart) {
            const itemIndex = cart.items.findIndex(item => item.shoe.toString() === shoeId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ shoe: shoeId, quantity: quantity });
            }
            await cart.save();
        } else {
            const newCart = new Cart({
                user: userId,
                items: [{ shoe: shoeId, quantity: quantity }]
            });
            await newCart.save();
        }
        res.status(201).json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
