const express = require('express');
const { getShoes, createShoe, getShoeById, updateShoe, deleteShoe } = require('../controllers/shoeController');
const router = express.Router();

router.get('/shoes', getShoes);
router.post('/shoes', createShoe);
router.get('/shoes/:id', getShoeById);
router.put('/shoes/:id', updateShoe);
router.delete('/shoes/:id', deleteShoe);

module.exports = router;
