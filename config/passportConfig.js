const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database_sql/pool');
const bcrypt = require('bcrypt');

passport.serializeUser((user, done) => {
    //console.log('Serializing user:', user);  // Add logging
    done(null, user.user_id);
});

passport.deserializeUser((id, done) => {
    //console.log('Deserializing user with id:', id);  // Add logging
    pool.query('SELECT * FROM users WHERE user_id = $1', [id], (err, result) => {
        if (err) {
            console.error('Error deserializing user:', err);
            return done(err, null);
        }
        //console.log('Deserialized user:', result.rows[0]);  // Log deserialized user
        done(null, result.rows[0]);
    });
});

// LocalStrategy
passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
            console.log(`Attempting login for email: ${email}`);

            const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            const user = userResult.rows[0];

            if (!user) {
                console.log(`No account found for email: ${email}`);
                return done(null, false, { message: 'Account does not exist. Please sign up.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.log(`Invalid credentials for email: ${email}`);
                return done(null, false, { message: 'Invalid credentials' });
            }

            console.log(`Login successful for email: ${email}`);
            return done(null, user);
        } catch (err) {
            console.error(`Error during login attempt: ${err}`);
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
        //console.log('Google profile:', profile); // Log the profile returned from Google

        const userResult = await pool.query('SELECT * FROM users WHERE google_id = $1', [profile.id]);
        let user = userResult.rows[0];

        if (user) {
            //console.log('User found:', user);
            return done(null, user);
        }

        //console.log('Creating new user for Google profile:', profile);
        const placeholderPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(placeholderPassword, 10);

        const newUser = await pool.query(
            `INSERT INTO users (google_id, first_name, last_name, email, password, password_reset_required) 
             VALUES ($1, $2, $3, $4, $5, true) 
             RETURNING *`,
            [profile.id, profile.name.givenName, profile.name.familyName, profile.emails[0].value, hashedPassword]
        );

        //console.log('New user created:', newUser.rows[0]);
        return done(null, newUser.rows[0]);
    } catch (err) {
        console.error('Error during Google OAuth:', err);
        return done(err, null);
    }
}));

//console.log("Passport Google OAuth configuration loaded");