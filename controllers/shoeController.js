const Shoe = require('../models/Shoe');

exports.getShoes = async (req, res) => {
    try {
        const shoes = await Shoe.find();
        res.json(shoes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createShoe = async (req, res) => {
    const { name, brand, availableSizes, inStockSizes, price, inStock } = req.body;
    try {
        const newShoe = new Shoe({ name, brand, availableSizes, inStockSizes, price, inStock });
        const shoe = await newShoe.save();
        res.status(201).json(shoe);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getShoeById = async (req, res) => {
    try {
        const shoe = await Shoe.findById(req.params.id);
        if (!shoe) return res.status(404).json({ message: 'Shoe not found' });
        res.json(shoe);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateShoe = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedShoeData = req.body;
        const updatedShoe = await Shoe.findByIdAndUpdate(id, updatedShoeData, { new: true, runValidators: true });
        if (!updatedShoe) return res.status(404).json({ message: 'Shoe not found' });
        res.json(updatedShoe);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteShoe = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedShoe = await Shoe.findByIdAndDelete(id);
        if (!deletedShoe) return res.status(404).json({ message: 'Shoe not found' });
        res.json({ message: 'Shoe deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
