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

        // Query to fetch order details and join with addresses table using address_id
        const orderResult = await pool.query(
            `SELECT o.order_id, o.order_date, o.total_price, o.total_items, o.payment_status,
                    a.name, a.street, a.city, a.state, a.country, a.postal_code
             FROM orders o
             LEFT JOIN addresses a ON o.address_id = a.address_id
             WHERE o.user_id = $1 AND o.order_id = $2`,
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

        // Add order items and address details to the order response
        order.items = orderItemsResult.rows;
        order.address = {
            name: order.name, 
            street: order.street,
            city: order.city,
            state: order.state,
            country: order.country,
            postal_code: order.postal_code,
        };

        // Clean up the unnecessary address fields from order object if you have included them in a nested address
        delete order.street;
        delete order.city;
        delete order.state;
        delete order.country;
        delete order.postal_code;

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