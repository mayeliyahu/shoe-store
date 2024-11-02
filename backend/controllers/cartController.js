const Cart = require("../models/Cart");

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId }).populate(
      "items.shoe"
    );
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addToCart = async (req, res) => {
  const { shoeId, userId, shoeSize, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ user: userId });
    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.shoe.toString() === shoeId
      );
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ shoe: shoeId, quantity: quantity, size: shoeSize });
      }
      await cart.save();
    } else {
      cart = new Cart({
        user: userId,
        items: [{ shoe: shoeId, quantity: quantity, size: shoeSize }],
      });
      await cart.save();
    }
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  const { userId } = req.params;
  const { shoeId } = req.query;
  try {
    const result = await Cart.updateOne(
      { user: userId },
      { $pull: { items: { shoe: shoeId } } }
    );
    res.status(200).json({ message: "shoe deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
