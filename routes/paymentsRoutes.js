const express = require('express');
const { createPaymentIntent } = require('../controllers/paymentsController');
const router = express.Router();

// Route to create a payment intent
/**
 * @swagger
 * /api/payments/create-payment-intent:
 *   post:
 *     summary: Creates a payment intent for the order
 *     tags:
 *       - Payments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               totalAmount:
 *                 type: number
 *                 description: Total amount for the order in dollars
 *     responses:
 *       200:
 *         description: Returns the client secret for the payment intent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clientSecret:
 *                   type: string
 *                   description: Stripe client secret
 *       500:
 *         description: Internal Server Error
 */
router.post('/create-payment-intent', createPaymentIntent);

module.exports = router;