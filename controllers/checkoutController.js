const pool = require('../database_sql/pool');

// Checkout function
exports.checkout = async (req, res) => {
    try {
        const { cart_id } = req.params;
        const { payment_details } = req.body;  // Placeholder for payment details

        // Validate the cart
        const cartResult = await pool.query('SELECT * FROM cart WHERE cart_id = $1', [cart_id]);

        if (cartResult.rows.length === 0) {
            return res.status(404).json({message: 'Cart not found!'});
        }

        const cart = cartResult.rows[0];

        // Get items in the cart
        const cartItemsResult = await pool.query(
            `SELECT ci.cart_item_id, ci.product_id, ci.quantity, ci.total_price, p.name, p.stock
             FROM cart_items ci
             JOIN products p ON ci.product_id = p.product_id
             WHERE ci.cart_id = $1`,
            [cart.cart_id]
        );

        const cartItems = cartItemsResult.rows;

        if (cartItems.length === 0) {
            return res.status(400).json({message: 'Cart is empty!'});
        }

        // Mock payment processing
        const paymentSuccessful = true;  // This should be replaced with actual payment processing logic
        if (!paymentSuccessful) {
            return res.status(402).json({message: 'Payment failed!'});
        }

        // Calculate total price and total items
        const total_price = cartItems.reduce((acc, item) => acc + item.total_price, 0);
        const total_items = cartItems.reduce((acc, item) => acc + item.quantity, 0);

        // Create an order
        const orderResult = await pool.query(
            `INSERT INTO orders (user_id, order_date, total_price, total_items, payment_status, address_id)
             VALUES ($1, NOW(), $2, $3, $4, $5) RETURNING order_id`,
            [cart.user_id, total_price, total_items, 'Paid', req.body.address_id]  // Assuming address_id is passed in the request body
        );

        const order = orderResult.rows[0];

        // Move items from cart to order_items
        for (let item of cartItems) {
            await pool.query(
                `INSERT INTO order_items (order_id, product_id, quantity, total_price)
                 VALUES ($1, $2, $3, $4)`,
                [order.order_id, item.product_id, item.quantity, item.total_price]
            );

            // Update the stock in products table
            const newStock = item.stock - item.quantity;
            await pool.query(
                `UPDATE products SET stock = $1 WHERE product_id = $2`,
                [newStock, item.product_id]
            );
        }

        // Clear the cart
        await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [cart_id]);

        res.status(201).json({
            message: 'Checkout successful, order created',
            order_id: order.order_id,
            total_price,
            total_items
        });
    } catch (err) {
        console.error('Error during checkout:', err);
        res.status(500).json({message: 'Server error during checkout'});
    }
};