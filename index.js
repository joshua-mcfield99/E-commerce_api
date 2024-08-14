// Imports
const express = require('express');


//Intialize app
const app = express();

//Port
const PORT = process.env.PORT || 3000;

//Test basic route
app.get('/', (req, res) => {
    res.send('Hello World');
});

//Listen
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}.`)
});
