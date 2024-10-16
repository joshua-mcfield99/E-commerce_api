const authenticateSession = (req, res, next) => {
    if (req.isAuthenticated()) {  // `isAuthenticated()` is provided by Passport.js
        return next();
    } else {
        return res.status(401).json({ message: 'Not authenticated' });
    }
};

module.exports = authenticateSession;
