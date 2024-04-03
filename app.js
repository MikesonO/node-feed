const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');

const app = express();

// Content-Type: application/json
app.use(bodyParser.json());

// Forward any incoming requests that starts with /feed
app.use('/feed', feedRoutes);

app.listen(8080);