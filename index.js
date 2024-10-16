// Imports
require('dotenv').config();
require('./config/passportConfig');
const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./database_sql/pool');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const orderRoutes = require('./routes/orderRoutes');
const addressRoutes = require('./routes/addressRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// Initialize app
const app = express();

// Enable CORS for all routes before any other middleware
app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
}));

// Handle preflight requests for all routes
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(204); // No content, just acknowledge the preflight request
});

// Session middleware for maintaining login sessions
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,  // Set to false to avoid storing empty sessions
    cookie: {
        secure: false,  // Set to true if using HTTPS
        httpOnly: true,  // Prevents client-side JS from reading the cookie
        maxAge: 1000 * 60 * 60 * 24  // 1-day session expiration
    }
}));

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Port
const PORT = process.env.PORT || 3001;

// Required for parsing POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Swagger configuration
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'E-commerce API',
            version: '1.0.0',
            description: 'API documentation for the E-commerce application',
        },
        servers: [
            {
                url: 'http://localhost:3001',
            },
        ],
    },
    apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Use the auth routes for handling registration and login
app.use('/api/auth', authRoutes);

// Product routes
app.use('/api/products', productRoutes);

// User routes
app.use('/api/users', userRoutes);

// Cart routes
app.use('/api/cart', cartRoutes);

// Checkout routes
app.use('/api/checkout', checkoutRoutes);

// Order routes
app.use('/api/orders', orderRoutes);

// Address routes
app.use('/api/address', addressRoutes);

// Category routes
app.use('/api/categories', categoryRoutes);

/*
// Test basic route
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Test route to fetch data from the database
app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
*/

// Shutdown the pool on SIGTERM signal
process.on('SIGTERM', () => {
    pool.end(() => {
        console.log('Pool has ended');
    });
});

// Listen
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}.`);
});