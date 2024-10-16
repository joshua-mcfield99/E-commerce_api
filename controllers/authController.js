const pool = require('../database_sql/pool');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register user
exports.registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password, phone } = req.body;

        if (!first_name || !last_name || !email || !password || !phone) {
            return res.status(400).json({ message: 'All fields required!' });
        }

        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (first_name, last_name, email, password, phone, role, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, 'customer', NOW(), NOW())
             RETURNING user_id, first_name, last_name, email, phone, role, created_at, updated_at`,
            [first_name, last_name, email, hashedPassword, phone]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Login user
/* Passport now acheives this
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required!' });
        }

        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(404).json({ message: 'Account does not exist. Please sign up.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { user_id: user.user_id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: {
                user_id: user.user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                created_at: user.created_at,
                updated_at: user.updated_at,
            }
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
*/

// Reset password
exports.resetPassword = async (req, res) => {
    const { token, password } = req.body;

    try {
        const userResult = await pool.query(
            'SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires > NOW()',
            [token]
        );
        const user = userResult.rows[0];

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            'UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expires = NULL, password_reset_required = false WHERE user_id = $2',
            [hashedPassword, user.user_id]
        );

        console.log('User object before logging in:', user);  // Log the user object

        res.status(200).json({ message: 'Password has been reset. Please log in again.', redirect: '/login' });
    } catch (error) {
        console.error('Error resetting password:', error);  // Log the error
        res.status(500).json({ message: 'Error resetting password' });
    }
};