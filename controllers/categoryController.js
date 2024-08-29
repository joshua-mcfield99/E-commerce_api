const pool = require('../database_sql/pool');

// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const { category_name } = req.body;

        const result = await pool.query(
            `INSERT INTO categories (category_name) 
             VALUES ($1) 
             RETURNING category_id, category_name`,
            [category_name]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating category:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all categories
exports.getCategories = async (req, res) => {
    try {
        const result = await pool.query('SELECT category_id, category_name FROM categories');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error retrieving categories:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT category_id, category_name FROM categories WHERE category_id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error retrieving category:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete category by ID
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const deleteResult = await pool.query(
            'DELETE FROM categories WHERE category_id = $1 RETURNING *',
            [id]
        );

        if (deleteResult.rowCount === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (err) {
        console.error('Error deleting category:', err);
        res.status(500).json({ message: 'Server error' });
    }
};