const pool = require('../database_sql/pool');

// Get the current user's cart
exports.getCart = async (req, res) => {
    try {
        const { user_id } = req.user;

        // Retrieve the user's cart
        const cartResult = await pool.query('SELECT * FROM cart WHERE user_id = $1', [user_id]);

        if (cartResult.rows.length === 0) {
            return res.status(404).json({ message: 'Cart not found!' });
        }

        const cart = cartResult.rows[0];

        // Retrieve items in the cart
        const cartItemsResult = await pool.query(
            `SELECT ci.cart_item_id, ci.product_id, p.name, p.description, p.price, ci.quantity, ci.total_price
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.product_id
            WHERE ci.cart_id = $1`,
           [cart.cart_id]
       );

       res.json({
           cart_id: cart.cart_id,
           user_id: cart.user_id,
           items: cartItemsResult.rows
       });
   } catch (err) {
       console.log('Error retrieving cart:', err);
       res.status(500).json({message: 'Server error'});
   }
};

// Add an item to the cart
exports.addItemToCart = async (req, res) => {
    try {
        const { user_id } = req.user;
        const { product_id, quantity } = req.body;

        if (!product_id || !quantity || quantity <= 0) {
            return res.status(400).json({message: 'Product ID and valid quantity are required!'});
        }

        // Fetch user's cart
        let cartResult = await pool.query('SELECT * FROM cart WHERE user_id = $1', [user_id]);
        let cart;

        // Create a new cart if it doesn't exist
        if (cartResult.rows.length === 0) {
            cartResult = await pool.query(
                'INSERT INTO cart (user_id) VALUES ($1) RETURNING *',
                [user_id]
            );
        }

        cart = cartResult.rows[0];

        // Check if the product is already in the cart
        const cartItemResult = await pool.query(
            'SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2',
            [cart.cart_id, product_id]
        );

        // Update the quantity and total price if the product already exists
        if (cartItemResult.rows.length > 0) {
            const cartItem = cartItemResult.rows[0];
            const newQuantity = cartItem.quantity + quantity;
            const newTotalPrice = newQuantity * cartItem.price;
            const updateResult = await pool.query(
                `UPDATE cart_items SET quantity = $1, total_price = $2, updated_at = NOW()
                 WHERE cart_item_id = $3 RETURNING *`,
                [newQuantity, newTotalPrice, cartItem.cart_item_id]
            );

            return res.json(updateResult.rows[0]);
        } else {
            // Retrieve the products price
            const productResult = await pool.query('SELECT price FROM products WHERE product_id = $1', [product_id]);
            if (productResult.rows.length === 0) {
                return res.status(404).json({message: 'Product not found!'});
            }

            const productPrice = productResult.rows[0].price;
            const totalPrice = productPrice * quantity;
            
            // Add new item to the cart
            const insertResult = await pool.query(
                `INSERT INTO cart_items (cart_id, product_id, quantity, total_price)
                 VALUES ($1, $2, $3, $4)
                 RETURNING cart_item_id, product_id, quantity, total_price`,
                [cart.cart_id, product_id, quantity, totalPrice]
            );

            return res.status(201).json(insertResult.rows[0]);
        }
    } catch (err) {
        console.log('Error adding item to cart:', err);
        res.status(500).json({message: 'Server error'});
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { cart_item_id } = req.params;
        const { quantity } = req.body;

        if (quantity === undefined || quantity < 0) {
            return res.status(400).json({ message: 'Quantity must be a non-negative value!' });
        }

        // Retrieve the cart item and join with the products table to get the price
        const cartItemResult = await pool.query(
            `SELECT ci.*, p.price 
             FROM cart_items ci 
             JOIN products p ON ci.product_id = p.product_id 
             WHERE ci.cart_item_id = $1`,
            [cart_item_id]
        );

        if (cartItemResult.rows.length === 0) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        const cartItem = cartItemResult.rows[0];

        if (quantity === 0) {
            // If quantity is zero, remove the item from the cart
            const deleteResult = await pool.query(
                'DELETE FROM cart_items WHERE cart_item_id = $1 RETURNING cart_item_id',
                [cart_item_id]
            );

            if (deleteResult.rows.length === 0) {
                return res.status(404).json({ message: 'Cart item not found' });
            }

            // Update the cart's updated_at timestamp
            const cart_id = cartItem.cart_id;
            await pool.query(
                `UPDATE cart SET updated_at = NOW() WHERE cart_id = $1`,
                [cart_id]
            );

            return res.json({ message: 'Item removed from cart' });
        } else {
            // Otherwise, update the quantity and total price
            const price = parseFloat(cartItem.price);

            if (isNaN(price)) {
                return res.status(500).json({ message: 'Invalid price value ' + cartItem.price });
            }

            const newTotalPrice = price * quantity;

            const updateResult = await pool.query(
                `UPDATE cart_items 
                 SET quantity = $1, total_price = $2 
                 WHERE cart_item_id = $3 
                 RETURNING cart_item_id, product_id, quantity, total_price`,
                [quantity, newTotalPrice, cart_item_id]
            );

            // Update the cart's updated_at timestamp
            const cart_id = cartItem.cart_id;
            await pool.query(
                `UPDATE cart SET updated_at = NOW() WHERE cart_id = $1`,
                [cart_id]
            );

            res.json(updateResult.rows[0]);
        }
    } catch (err) {
        console.log('Error updating cart item:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Remove an item from the cart
exports.removeItemFromCart = async (req, res) => {
    try {
        const { cart_item_id } = req.params;

        const deleteResult = await pool.query(
            `DELETE FROM cart_items WHERE cart_item_id = $1 RETURNING cart_item_id`,
            [cart_item_id]
        );

        if (deleteResult.rows.length === 0) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        res.json({ message: 'Item removed from cart' });
    } catch (err) {
        console.error('Error removing item from cart:', err);
        res.status(500).json({ message: 'Server error' });
    }
};