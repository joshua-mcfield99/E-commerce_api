const express = require('express');
const {
    getUserOrders,
    getOrderDetails,
    deleteOrder
} = require('../controllers/orderController');
const authenticateToken = require('../middleware/authMiddleware');
const checkAdminRole = require('../middleware/adminMiddleware'); 

const router = express.Router();

// Get all orders for the current user
/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Retrieve all orders for the current user
 *     tags:
 *       - Orders
 *     responses:
 *       200:
 *         description: A list of orders.
 *       404:
 *         description: No orders found.
 */
router.get('/orders', authenticateToken, getUserOrders);

// Get details of a specific order
/**
 * @swagger
 * /api/orders/{order_id}:
 *   get:
 *     summary: Retrieve details of a specific order
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: order_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The order ID.
 *     responses:
 *       200:
 *         description: Order details.
 *       404:
 *         description: Order not found.
 */
router.get('/orders/:order_id', authenticateToken, getOrderDetails);

// Delete an order (Admin only)
/**
 * @swagger
 * /api/orders/{order_id}:
 *   delete:
 *     summary: Delete an order by ID (Admin only)
 *     description: Only accessible by admin users.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: order_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The order ID.
 *     responses:
 *       200:
 *         description: Order deleted.
 *       403:
 *         description: Access denied.
 *       404:
 *         description: Order not found.
 */
router.delete('/orders/:order_id', authenticateToken, checkAdminRole, deleteOrder);

module.exports = router;