const express = require('express');
const {
    getCart,
    addItemToCart,
    updateCartItem,
    removeItemFromCart
} = require('../controllers/cartController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Get the user's cart
router.get('/cart', authenticateToken, getCart);

// Add an item to the cart
router.post('/cart/items', authenticateToken, addItemToCart);

// Update an item's quantity in the cart
router.put('/cart/items/:cart_item_id', authenticateToken, updateCartItem);

// Remove an item from the cart
router.delete('/cart/items/:cart_item_id', authenticateToken, removeItemFromCart);

module.exports = router;