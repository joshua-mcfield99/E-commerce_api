const pool = require('../database_sql/pool');

exports.addAddress = async (req, res) => {
    try {
        const { street, city, state, country, postal_code } = req.body;
        const user_id = req.user.user_id;

        const result = await pool.query(
            `INSERT INTO addresses (street, city, state, country, postal_code, user_id, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
             RETURNING address_id, street, city, state, country, postal_code, user_id, created_at, updated_at`,
            [street, city, state, country, postal_code, user_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding address:', err);
        res.status(500).json({ message: 'Server error' });
    }
};