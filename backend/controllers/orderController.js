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

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { name, email },
        { new: true, runValidators: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

exports.getOrderReports = async (req, res) => {
    try {
        const orders = await Order.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },  // Group by year
                        month: { $month: "$createdAt" }, // Group by month
                        day: { $dayOfMonth: "$createdAt" } // Group by day
                    },
                    totalOrders: { $sum: 1 } // Count the number of orders on each day
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } // Sort by year, month, and day
            }
        ]);
        let cumulativeOrders = 0;
        const cumulativeData = orders.map(order => {
            cumulativeOrders += order.totalOrders; // Keep adding to cumulative count
            return {
                _id: {...order._id},
                cumulativeOrders
            };
        });

        res.json(cumulativeData);
    } catch (err) {
        console.log({err})
        res.status(500).json({ error: err.message });
    }
};

