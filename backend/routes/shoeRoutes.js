const express = require("express");
const {
  getShoes,
  createShoe,
  getShoeById,
  updateShoe,
  deleteShoe,
  getNewItemsShoes,
  getSearchedShoesByName,
} = require("../controllers/shoeController");
const router = express.Router();

router.get("/", getShoes);
router.get("/new-items", getNewItemsShoes);
router.get("/search", getSearchedShoesByName);
router.post("/", createShoe);
router.get("/:id", getShoeById);
router.put("/:id", updateShoe);
router.delete("/:id", deleteShoe);

module.exports = router;
