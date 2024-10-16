const express = require('express');
const {
    getCart,
    addItemToCart,
    updateCartItem,
    removeItemFromCart
} = require('../controllers/cartController');
const authenticateSession = require('../middleware/authMiddleware');

const router = express.Router();

// Get the user's cart
/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Retrieve the current user's cart
 *     tags:
 *       - Cart
 *     responses:
 *       200:
 *         description: The user's cart with items.
 *       404:
 *         description: Cart not found.
 */
router.get('/', authenticateSession, getCart);

// Add an item to the cart
/**
 * @swagger
 * /api/cart/items:
 *   post:
 *     summary: Add an item to the cart
 *     tags:
 *       - Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: The item added to the cart.
 *       400:
 *         description: Invalid input.
 */
router.post('/items', authenticateSession, addItemToCart);

// Update an item's quantity in the cart
/**
 * @swagger
 * /api/cart/items/{cart_item_id}:
 *   put:
 *     summary: Update an item in the cart
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         name: cart_item_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The cart item ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: The updated cart item.
 *       404:
 *         description: Cart item not found.
 */
router.put('/items/:cart_item_id', authenticateSession, updateCartItem);

// Remove an item from the cart
/**
 * @swagger
 * /api/cart/items/{cart_item_id}:
 *   delete:
 *     summary: Remove an item from the cart
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         name: cart_item_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The cart item ID.
 *     responses:
 *       200:
 *         description: Item removed from cart.
 *       404:
 *         description: Cart item not found.
 */
router.delete('/items/:cart_item_id', authenticateSession, removeItemFromCart);

module.exports = router;