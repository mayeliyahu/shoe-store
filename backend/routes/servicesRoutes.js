const express = require('express');
const router = express.Router();
const { getStockPrices } = require('../controllers/servicesController');

// Define route for fetching stock prices
router.get('/stock-prices', getStockPrices);

module.exports = router;