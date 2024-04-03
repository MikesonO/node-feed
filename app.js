const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');

const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

// Content-Type: application/json
app.use(bodyParser.json());

// Resolve CORS error
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // '*' allows access to any client OR 'codepen.io' for specific access.
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE'); // Methods to allow clients
    res.setHeader('Access-Control-Allow-Headers', ' Content-Type, Authorization');
    next();
})

// Forward any incoming requests that starts with /feed
app.use('/feed', feedRoutes);

mongoose.connect(MONGODB_URI)
    .then(result => {
        app.listen(8080);
    })
    .catch(err => {
        console.log(err);
    })

