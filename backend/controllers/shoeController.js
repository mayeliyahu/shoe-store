const fs = require("fs");
const path = require("path");
const Shoe = require("../models/Shoe");

exports.getShoes = async (req, res) => {
  try {
    const filterQuery = {};
    const userQuery = req.query;

    if (userQuery.name) {
      filterQuery.name = userQuery.name;
    }
    if (userQuery.brand) {
      filterQuery.brand = userQuery.brand;
    }

    if (userQuery.size) {
      filterQuery.availableSizes = { $in: [userQuery.size] };
    }

    if (userQuery.gender) {
      filterQuery.gender = { $in: [userQuery.gender, "unisex"] };
    }

    if (userQuery.minPrice || userQuery.maxPrice) {
      filterQuery.price = {};
      if (userQuery.minPrice) {
        filterQuery.price.$gte = userQuery.minPrice; // Greater than or equal to minPrice
      }
      if (userQuery.maxPrice) {
        filterQuery.price.$lte = userQuery.maxPrice; // Less than or equal to maxPrice
      }
    }
    const shoes = await Shoe.find(filterQuery);
    res.json(shoes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

async function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

exports.createShoe = async (req, res) => {
  const {
    name,
    brand,
    availableSizes,
    inStockSizes,
    price,
    gender,
    salePrice,
    imageLocalPath,
    imageNewPath,
  } = req.body;
  try {
    const fullImagePath = path.join(__dirname, "../frontend/", imageNewPath);
    await ensureDirectoryExists(fullImagePath);
    fs.rename(imageLocalPath, fullImagePath, (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to move the image file" });
      }
      // Save shoe data without the image file
      const newShoe = new Shoe({
        name,
        brand,
        availableSizes,
        inStockSizes,
        price,
        gender,
        salePrice,
      });
      newShoe
        .save()
        .then((savedShoe) => res.status(201).json(savedShoe))
        .catch((err) => res.status(500).json({ error: err.message }));
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getShoeById = async (req, res) => {
  try {
    const shoe = await Shoe.findById(req.params.id);
    if (!shoe) return res.status(404).json({ message: "Shoe not found" });
    res.json(shoe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateShoe = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedShoeData = req.body;
    const updatedShoe = await Shoe.findByIdAndUpdate(id, updatedShoeData, {
      new: true,
      runValidators: true,
    });
    if (!updatedShoe)
      return res.status(404).json({ message: "Shoe not found" });
    res.json(updatedShoe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteShoe = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedShoe = await Shoe.findByIdAndDelete(id);
    if (!deletedShoe)
      return res.status(404).json({ message: "Shoe not found" });
    res.json({ message: "Shoe deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNewItemsShoes = async (req, res) => {
  try {
    const newItemsShoes = await Shoe.find({}).sort({ createdAt: -1 }).limit(6);
    res.json(newItemsShoes);
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSearchedShoesByName = async (req, res) => {
  try {
    if (!req.query.name) return res.json([]);
    const searchedShoes = await Shoe.find({
      name: { $regex: req.query.name, $options: "i" },
    }).limit(5);

    res.json(searchedShoes);
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};
