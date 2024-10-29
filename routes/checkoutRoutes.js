const express = require('express');
const { checkout } = require('../controllers/checkoutController');
const authenticateSession = require('../middleware/authMiddleware');

const router = express.Router();

// Checkout endpoint
/**
 * @swagger
 * /api/checkout/cart/{cart_id}:
 *   post:
 *     summary: Checkout the cart and create an order
 *     tags:
 *       - Checkout
 *     parameters:
 *       - in: path
 *         name: cart_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The cart ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               payment_details:
 *                 type: string
 *               address_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Order created.
 *       400:
 *         description: Checkout failed.
 */
router.post('/cart/:cart_id', checkout); // Temporarily removed authenticateSession

module.exports = router;