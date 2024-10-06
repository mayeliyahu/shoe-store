const express = require('express');
const { getOrders, createOrder, getOrderReports} = require('../controllers/orderController');
const router = express.Router();

router.get('/user/:userId', getOrders);
router.post('/', createOrder);
router.get('/reports', getOrderReports);

module.exports = router;
