const pool = require('../database_sql/pool');

const authUser = async (req, res, next) => {
    const { user_id, role } = req.user;
    const { userId } = req.params;

    if (role === 'admin') {
        // Admins have full access
        return next();
    }

    if (parseInt(userId, 10) !== user_id) {
        return res.status(403).json({ message: 'Access denied: You can only access your own account information' });
    }

    next();
};

module.exports = authUser;
