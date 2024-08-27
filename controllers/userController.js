const pool = require('../database_sql/pool');
const bcrypt = require('bcrypt');

// Get all users excluding passwords (Admin only)
exports.getAllusers = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT user_id, first_name, last_name, email, phone, role, created_at, updated_at FROM users'
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.log('Error fetching users:', err);
        res.status(500).json({message: 'Server Error'});
    }
};

// Get user by ID excluding password (Admin or the User)
exports.getUserById = async (req, res) => {
    try {
        const { user_id } = req.params;
        const result = await pool.query(
            'SELECT user_id, first_name, last_name, email, phone, role, created_at, updated_at FROM users WHERE user_id = $1',
            [user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({message: 'User not found!'});
        }

        res.status(200).json(result.rows[0]);

    } catch (err) {
        console.log('Error fetching user:', err);
        res.status(500).json({message: 'Server Error'});
    }
};

// Update user by ID (Admin or the User)
exports.updateUserById = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { first_name, last_name, email, phone, password } = req.body;

        //Fetch user
        const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({message: 'User not found!'});
        }

        const user = userResult.rows[0];

        // Prepare updated details fallback to original if not updated
        const updatedFirstName = first_name || user.first_name;
        const updatedLastName = last_name || user.last_name;
        const updatedEmail = email || user.email;
        const updatedPhone = phone || user.phone;
        let updatedPassword = password || user.password;

        //Hash the new password
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updatedPassword = await bcrypt.hash(password, salt);
        }

        //Update user in database
        const updateResult = await pool.query(
            `UPDATE users SET
                first_name = $1,
                last_name = $2,
                email = $3,
                phone = $4,
                password = $5,
                updated_at NOW()
            WHERE user_id = $6
            RETURNING user_id, first_name, last_name, email, phone, role, created_at, updated_at`,
            [
                updatedFirstName,
                updatedLastName,
                updatedEmail,
                updatedPhone,
                updatedPassword,
                user_id
            ]
        );

        res.status(200).json(updateResult.rows[0]);

    } catch (err) {
        console.log('Error updating user:', err);

        if (err.code === '23505') {
            // Unique violation error code for PostgreSQL
            return res.status(400).json({ message: 'Email already in use!' });
        }

        res.status(500).json({ message: 'Server error' });
    }
};