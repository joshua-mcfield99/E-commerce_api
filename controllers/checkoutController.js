const pool = require('../database_sql/pool');

// Checkout function to create order and order items based on cart data
exports.checkout = async (req, res) => {
    try {
        const { cart_id } = req.params;
        const { payment_details, address_id } = req.body;

        // Validate cart
        const cartResult = await pool.query('SELECT * FROM cart WHERE cart_id = $1', [cart_id]);
        if (cartResult.rows.length === 0) return res.status(404).json({ message: 'Cart not found!' });
        
        const cartItemsResult = await pool.query(
            `SELECT ci.cart_item_id, ci.product_id, ci.quantity, ci.total_price, p.name, p.stock
             FROM cart_items ci
             JOIN products p ON ci.product_id = p.product_id
             WHERE ci.cart_id = $1`,
            [cart_id]
        );

        const cartItems = cartItemsResult.rows;
        if (cartItems.length === 0) return res.status(400).json({ message: 'Cart is empty!' });

        // Calculate total
        const total_price = cartItems.reduce((acc, item) => acc + parseFloat(item.total_price), 0);
        const total_items = cartItems.reduce((acc, item) => acc + item.quantity, 0);

        // Create order
        const orderResult = await pool.query(
            `INSERT INTO orders (user_id, order_date, total_price, total_items, payment_status, address_id)
             VALUES ($1, NOW(), $2, $3, $4, $5) RETURNING order_id`,
            [cartResult.rows[0].user_id, total_price, total_items, 'Paid', address_id]
        );
        const order = orderResult.rows[0];

        // Insert order items and update product stock
        for (let item of cartItems) {
            await pool.query(
                `INSERT INTO order_items (order_id, product_id, quantity, total_price)
                 VALUES ($1, $2, $3, $4)`,
                [order.order_id, item.product_id, item.quantity, parseFloat(item.total_price)]
            );
            await pool.query(
                `UPDATE products SET stock = $1 WHERE product_id = $2`,
                [item.stock - item.quantity, item.product_id]
            );
        }

        // Clear cart after order creation
        await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [cart_id]);

        res.status(201).json({
            message: 'Checkout successful, order created',
            order_id: order.order_id,
            total_price,
            total_items,
        });
    } catch (err) {
        console.error('Error during checkout:', err);
        res.status(500).json({ message: 'Server error during checkout' });
    }
};