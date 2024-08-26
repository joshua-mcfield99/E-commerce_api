const pool = require('database_sql/pool');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
    try {
        const {first_name, last_name, email, password, phone} = req.body;

        // Validate request body
        if (!first_name || !last_name || !email || !password || !phone) {
            return res.status(400).json('All fields required!');
        }

        // Check user exists
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json('User already exists!');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Add user to db, role is always set to 'customer' on registration
        const result = await pool.query(
            `INSERT INTO users (first_name, last_name, email, password, phone, role, created_at, updated_at)
            VALUES ($1,$2, $3, $4, $5, 'customer', NOW(), NOW())
            RETURNING user_id, first_name, last_name, email, phone, role, created_at, updated_at`,
            [first_name, last_name, email, hashedPassword, phone]
        );

        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};