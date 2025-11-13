const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Get all orders
router.get('/', orderController.getAllOrders);

// Get single order details
router.get('/:id', orderController.getOrderDetails);

// Sync orders from Shopify
router.post('/sync', orderController.syncOrders);

module.exports = router;
