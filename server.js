//===================== DEPENDENCIES =======================================================================

// Require dependencies
const express = require("express");
const exphbs = require('express-handlebars');
const logger = require("morgan");
const mongoose = require("mongoose");

// Axios and Cheerio for scraping news headlines from the web
const axios = require("axios");
const cheerio = require("cheerio");

// Import models from models directory
const db = require("./models");

// Set initial port and host and allow port to be set by Heroku
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

// Initialize Express
const app = express();

//============ EXPRESS/MIDDLEWARE CONFIGURATION ===============================================================

// Use morgan logger for realtime request logging 
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Reveal contents of public directory to the server
app.use(express.static("public"));

// Tell app to use handlebars and set default page to serve.
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Connect to the Mongo DB and allow for connection to deployed database for Heroku
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

//============== ROUTES =========================================================================================

const routes = require('./routes/routes.js');
app.use(routes);

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("http://www.echojs.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article h2").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {

    db.Article.find({})
  .then(function(dbArticle) {
    res.json(dbArticle)
  })
  .catch(function(err) {
    res.json(err);
  });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  
  db.Article.findOne({ _id: req.params.id })
  .populate("note")
  .then(function(dbArticle) {
    res.json(dbArticle)
  })
  .catch(function(err) {
    res.json(err);
  });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  
  db.Note.create(req.body)
  .then(function(dbNote) {
    return db.Article.findOneAndUpdate({ _id: req.params.id}, { note: dbNote._id}, { new: true });
  })
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});

//============ INITIATION ===============================================================================

// Start the server
app.listen(PORT, function() {
  console.log("🔮 App running on port " + PORT + "!");
});