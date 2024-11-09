const Order = require("../models/Order");
const Cart = require("../models/Cart");

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

exports.getOrders = async (req, res) => {
  try {
    const orderQuery = req.query;
    let orders = [];
    if (orderQuery.orderId) {
      orders = await Order.find({
        user: req.params.userId,
        _id: orderQuery.orderId,
      })
        .sort({ createdAt: -1 })
        .populate("items.shoe");
    } else {
      orders = await Order.find({ user: req.params.userId })
        .sort({ createdAt: -1 })
        .populate("items.shoe");
    }
    if (orders == []) return orders;
    const formattedOrders = orders.map((order) => ({
      ...order.toObject(),
      createdAt: formatDate(order.createdAt),
    }));

    res.json(formattedOrders);
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

exports.getOrderReports = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" }, // Group by year
            month: { $month: "$createdAt" }, // Group by month
            day: { $dayOfMonth: "$createdAt" }, // Group by day
          },
          totalOrders: { $sum: 1 }, // Count the number of orders on each day
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }, // Sort by year, month, and day
      },
    ]);
    let cumulativeOrders = 0;
    const cumulativeData = orders.map((order) => {
      cumulativeOrders += order.totalOrders; // Keep adding to cumulative count
      return {
        _id: { ...order._id },
        cumulativeOrders,
      };
    });
    console.log({ cumulativeData });
    res.json(cumulativeData);
  } catch (err) {
    console.log({ err });
    res.status(500).json({ error: err.message });
  }
};
