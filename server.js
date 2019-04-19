//===================== DEPENDENCIES =======================================================================

// Require dependencies
const express = require('express');
const exphbs = require('express-handlebars');
const logger = require('morgan');
const mongoose = require('mongoose');

// Axios and Cheerio for scraping news headlines from the web
const axios = require('axios');
const cheerio = require('cheerio');

// Import models from models directory
const db = require('./models');

// Set initial port and host and allow port to be set by Heroku
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Initialize Express
const app = express();

//============ EXPRESS/MIDDLEWARE CONFIGURATION ===============================================================

// Use morgan logger for realtime request logging 
app.use(logger('dev'));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Reveal contents of public directory to the server
app.use(express.static('public'));

// Tell app to use handlebars and set default page to serve.
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Connect to the Mongo DB and allow for connection to deployed database for Heroku
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mongoHeadlines';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

//============== ROUTING =========================================================================================

// Import routes from my routes directory
const routes = require('./routes/routes.js');
app.use(routes);

//============ INITIATION ===============================================================================

// Start the server
app.listen(PORT, function() {
  console.log('🔮 App running on port ' + PORT + '!');
});