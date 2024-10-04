const express = require('express');
const { getShoes, createShoe, getShoeById, updateShoe, deleteShoe } = require('../controllers/shoeController');
const router = express.Router();

router.get('/', getShoes);
router.post('/', createShoe);
router.get('/:id', getShoeById);
router.put('/:id', updateShoe);
router.delete('/:id', deleteShoe);

module.exports = router;
