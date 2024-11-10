const StoreBranch = require('../models/StoreBranch');

exports.getStoreBranches = async (req, res) => {
    try {
        const branches = await StoreBranch.find();
        res.json(branches);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createStoreBranch = async (req, res) => {
    const { name, address, rating, contactNumber, openingHours } = req.body;
    try {
        const newBranch = new StoreBranch({name, address, rating, contactNumber, openingHours});
        const branch = await newBranch.save();
        res.status(201).json(branch);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getStoreBranchById = async (req, res) => {
    try {
        const branch = await StoreBranch.findById(req.params.id);
        if (!branch) return res.status(404).json({ message: 'Branch not found' });
        res.json(branch);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateStoreBranch = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedBranchData = req.body;
        const updatedBranch = await StoreBranch.findByIdAndUpdate(id, updatedBranchData, { new: true, runValidators: true });
        if (!updatedBranch) return res.status(404).json({ message: 'Branch not found' });
        res.json(updatedBranch);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteStoreBranch = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBranch = await StoreBranch.findByIdAndDelete(id);
        if (!deletedBranch) return res.status(404).json({ message: 'Branch not found' });
        res.json({ message: 'Branch deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
