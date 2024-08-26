const pool = require('../database_sql/pool');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Register user
exports.registerUser = async (req, res) => {
    try {
        const {first_name, last_name, email, password, phone} = req.body;

        // Validate request body
        if (!first_name || !last_name || !email || !password || !phone) {
            return res.status(400).json({message: 'All fields required!'});
        }

        // Check user exists
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({message: 'User already exists!'});
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

// Login user
exports.loginUser = async (req, res) => {
    try {
        const { email, password} = req.body;

        // Validate request body
        if (!email || !password) {
            return res.status(400).json({message: 'Email and password required!'});
        }

        // Check user exists
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(401).json({message: 'Invalid credentials!'});
        }

        // Valdiate password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({message: 'Invalid  credentials'});
        }

        // Generate token
        const token = jwt.sign(
            { user_id: user.user_id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h'}
        );

        // Send token and user info in the response (Excluding password)
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
        console.log(err.message);
        res.status(500).send('Server Error')
    }
};