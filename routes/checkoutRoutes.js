const express = require('express');
const { checkout } = require('../controllers/checkoutController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Checkout endpoint
router.post('/cart/:cart_id/checkout', authenticateToken, checkout);

module.exports = router;