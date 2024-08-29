const pool = require('../database_sql/pool');

// Get all orders for the current user
exports.getUserOrders = async (req, res) => {
    try {
        const { user_id } = req.user;

        const ordersResult = await pool.query(
            `SELECT order_id, order_date, total_price, total_items, payment_status, address_id 
             FROM orders 
             WHERE user_id = $1 
             ORDER BY order_date DESC`,
            [user_id]
        );

        res.status(200).json(ordersResult.rows);
    } catch (err) {
        console.error('Error retrieving orders:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get details of a specific order for the current user
exports.getOrderDetails = async (req, res) => {
    try {
        const { user_id } = req.user;
        const { order_id } = req.params;

        // Check if the order belongs to the user
        const orderResult = await pool.query(
            `SELECT order_id, order_date, total_price, total_items, payment_status, address_id 
             FROM orders 
             WHERE user_id = $1 AND order_id = $2`,
            [user_id, order_id]
        );

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const order = orderResult.rows[0];

        // Get items in the order
        const orderItemsResult = await pool.query(
            `SELECT oi.order_items_id, oi.product_id, p.name, p.description, p.price, oi.quantity, oi.total_price
             FROM order_items oi
             JOIN products p ON oi.product_id = p.product_id
             WHERE oi.order_id = $1`,
            [order.order_id]
        );

        order.items = orderItemsResult.rows;

        res.status(200).json(order);
    } catch (err) {
        console.error('Error retrieving order details:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin can delete an order
exports.deleteOrder = async (req, res) => {
    try {
        const { order_id } = req.params;

        const deleteResult = await pool.query(
            `DELETE FROM orders WHERE order_id = $1 RETURNING order_id`,
            [order_id]
        );

        if (deleteResult.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (err) {
        console.error('Error deleting order:', err);
        res.status(500).json({ message: 'Server error' });
    }
};