const express = require('express');

const feedRoutes = require('./routes/feed');

const app = express();

// Forward any incoming requests that starts with /feed
app.use('/feed', feedRoutes);

app.listen(8080);