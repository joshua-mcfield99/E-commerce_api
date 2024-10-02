const pool = require('../database_sql/pool');

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category_id } = req.body;

        if (!name || !description || !price || !stock || !category_id) {
            res.status(400).json({message: 'All fields required!'});
        }

        const result = await pool.query(
            `INSERT INTO products (name, description, price, stock, category_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING product_id, name, description, price, stock, category_id`,
            [name, description, price, stock, category_id]
        );
        console.log(result.rows[0]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.log(err.message);
        console.log(result.rows[0]);
        res.status(500).send('Server Error')
    }
};

// Get all products, optional filtering by category name
exports.getProducts = async (req, res) => {
    try {
        const { category } = req.query;
        let query = `
            SELECT products.*, categories.category_name 
            FROM products 
            JOIN categories ON products.category_id = categories.category_id
        `;
        let params = [];

        if (category) {
            query += ' WHERE categories.category_name = $1';
            params.push(category);
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
};

// Get product by ID
exports.getProductById = async (req, res) => {
    try {
        const { productId } = req.params; 

        const result = await pool.query(`
            SELECT products.*, categories.category_name 
            FROM products 
            JOIN categories 
            ON products.category_id = categories.category_id
            WHERE products.product_id = $1
        `, [productId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
};

// Update product by ID
exports.updateProduct = async (req, res) => {
    try {
        const { product_id } = req.params;
        const { name, description, price, stock, category_id } = req.body;

        const result = await pool.query(
            `UPDATE products SET name = $1, description = $2, price = $3, stock = $4, category_id = $5, updated_at = NOW()
            WHERE product_id = $6
            RETURNING product_id, name, description, price, stock, category_id`,
            [name, description, price, stock, category_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({message: 'Product not found!'});
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete product by id
exports.deleteProduct = async (req, res) => {
    try {
        const { product_id } = req.params;

        const result = await pool.query('DELETE FROM products WHERE product_id = $1 RETURNING product_id', [product_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({message: 'Product not found!'});
        }

        res.json({message: ' Product deleted successfully'});
    } catch (error) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
};