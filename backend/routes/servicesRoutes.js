const express = require('express');
const router = express.Router();
const { getStockPrices , getRecentTweets } = require('../controllers/servicesController');

router.get('/stock-prices', getStockPrices);
router.get('/tweets/getRecent', getRecentTweets);

module.exports = router;