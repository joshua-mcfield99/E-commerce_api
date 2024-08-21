// Imports
require('dotenv').config();
const express = require('express');
const pool = require('./database_sql/pool');

//Intialize app
const app = express();

//Port
const PORT = process.env.PORT || 3000;

//Test basic route
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

// Shutdown the pool on SIGTERM signal
process.on('SIGTERM', () => {
    pool.end(() => {
        console.log('Pool has ended');
    });
});

//Listen
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}.`)
});
