const express = require("express");
const {
  getOrders,
  createOrder,
  getOrderReports,
  getAllOrders,
} = require("../controllers/orderController");
const router = express.Router();

router.get("/user/:userId", getOrders);
router.post("/", createOrder);
router.get("/reports", getOrderReports);
router.get("/getall", getAllOrders);


module.exports = router;
