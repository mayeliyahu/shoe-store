const express = require("express");
const {
  getCart,
  addToCart,
  removeFromCart,
} = require("../controllers/cartController");
const router = express.Router();

router.get("/:userId", getCart);
router.post("/", addToCart);
router.delete("/:userId", removeFromCart);

module.exports = router;
