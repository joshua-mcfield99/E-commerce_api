const jwt = require('jsonwebtoken');
const pool = require('../database_sql/pool');

const checkAdminRole = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({message: 'Access denied: No token provided!'});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await pool.query('SELECT role FROM users WHERE user_id = $1', [decoded.user_id]);

        if (user.rows[0].role !== 'admin') {
            return res.status(403).json({message: 'Access denied: Admin only!'});
        }

        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({message: 'Invalid token or unauthorized access!'});
    }
};

module.exports = checkAdminRole;