const Shoe = require("../models/Shoe");
const fs = require("fs");
const path = require("path");
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

    if (userQuery.sale && userQuery.sale == "true") {
      filterQuery.salePrice = { $ne: null };
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

exports.createShoe = async (req, res) => {
  console.log(req.body);
  const {
    name,
    brand,
    availableSizes,
    inStockSizes,
    price,
    gender,
    salePrice,
    fullFilePath,
    imageNewPath,
  } = req.body;
  const defaultImage = path.join(
    __dirname,
    "../frontend/images/default-image.png"
  );
  const fullImagePath = path.join(__dirname, "../../frontend/", imageNewPath);
  try {
    const dir = path.dirname(fullImagePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const sourceImagePath =
      fullFilePath && fs.existsSync(fullFilePath) ? fullFilePath : defaultImage;
    fs.copyFile(sourceImagePath, fullImagePath, (err) => {
      if (err) {
        return res.status(500).json({
          error: `Failed to copy the image file from ${sourceImagePath}`,
        });
      }
      saveShoeData(
        name,
        brand,
        availableSizes,
        inStockSizes,
        price,
        gender,
        salePrice,
        res
      );
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const saveShoeData = (
  name,
  brand,
  availableSizes,
  inStockSizes,
  price,
  gender,
  salePrice,
  res
) => {
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

exports.addSizesToInStock = async (req, res) => {
  const { id } = req.params;
  const { newSizes } = req.body;
  try {
    // Add new sizes to the inStockSizes array if they don't already exist
    await Shoe.updateOne(
      { _id: id },
      { $addToSet: { inStockSizes: { $each: newSizes } } }
    );

    console.log("New sizes added to inStockSizes.");
  } catch (error) {
    console.error("Error adding sizes to inStockSizes:", error);
  }
};
