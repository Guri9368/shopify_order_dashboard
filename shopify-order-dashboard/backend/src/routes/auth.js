const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyShopify = require('../middleware/verifyShopify');

// Install route
router.get('/install', authController.install);

// OAuth callback route
router.get('/callback', verifyShopify, authController.callback);

module.exports = router;
