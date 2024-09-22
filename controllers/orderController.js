const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId }).populate('items.shoe');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createOrder = async (req, res) => {
    const { userId, items, total } = req.body;
    try {
        const newOrder = new Order({ user: userId, items: items, total: total });
        const order = await newOrder.save();
        await Cart.findOneAndDelete({ user: userId });
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
