// Require my dependencies
const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../models')
const express = require('express');
const exphbs = require('express-handlebars');

// Establish express router connection for export
const router = express.Router();

//============= HTML ROUTES ====================================================================    

  router.get('/', (req, res) => {
    res.render('index');
  });

  router.get('/saved', (req, res) => {
      res.render('saved');
  });

//============= API ROUTES ====================================================================    

  // A GET route for scraping the onion website for articles
  router.get('/scrape', (req, res) => {
    // Grab body html with axios
    axios.get('https://www.theonion.com/').then(function(response) {
      // Load response into cheerio and store in local variable for a shorthand selector
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
      res.send("News has been scraped");
    });
  });
  
  // Route for getting all Articles from the db
  router.get("/articles", (req, res) => {
  
      db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle)
    })
    .catch(function(err) {
      res.json(err);
    });
  });
  
  // Route for grabbing a specific Article by id, populate it with it's note
  router.get("/articles/:id", (req, res) => {
    
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
  router.post("/articles/:id", (req, res) => {
    
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

// Export router for use from my server  
module.exports = router;
