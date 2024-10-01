const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database_sql/pool');
const bcrypt = require('bcrypt');

passport.serializeUser((user, done) => {
    done(null, user.user_id);
});

passport.deserializeUser((id, done) => {
    pool.query('SELECT * FROM users WHERE user_id = $1', [id], (err, result) => {
        if (err) {
            return done(err, null);
        }
        done(null, result.rows[0]);
    });
});

// LocalStrategy
passport.use(new LocalStrategy(
    { usernameField: 'email' }, // Use email instead of username
    async (email, password, done) => {
        try {
            const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            const user = userResult.rows[0];

            if (!user) {
                return done(null, false, { message: 'Account does not exist. Please sign up.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Invalid credentials' });
            }

            return done(null, user); // User authenticated successfully
        } catch (err) {
            return done(err);
        }
    }
));

// Google OAuth Stratergy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
async (accessToken, refreshToken, profile, done) => {
    try {
        const userResult = await pool.query('SELECT * FROM users WHERE google_id = $1', [profile.id]);
        let user = userResult.rows[0];

        if (user) {
            return done(null, user);
        }

        const placeholderPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(placeholderPassword, 10);

        const newUser = await pool.query(
            `INSERT INTO users (google_id, first_name, last_name, email, password, password_reset_required) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,
            [profile.id, profile.name.givenName, profile.name.familyName, profile.emails[0].value, hashedPassword, true]
        );

        return done(null, newUser.rows[0]);
    } catch (err) {
        return done(err, null);
    }
}));

console.log("Passport Google OAuth configuration loaded");