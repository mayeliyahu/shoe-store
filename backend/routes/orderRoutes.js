const express = require('express');
const { getOrders, createOrder, deleteUser ,updateUser, getOrderReports} = require('../controllers/orderController');
const router = express.Router();

router.get('/user/:userId', getOrders);
router.post('/', createOrder);
router.delete('/:id', deleteUser);
router.get('/reports', getOrderReports);



module.exports = router;
