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
    // Grab body html with axios, used news-in-brief page because of more consistent elements
    axios.get('https://www.theonion.com/c/news-in-brief').then(response => {
      // Load response into cheerio and store in local variable for a shorthand selector
      const $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $('div.item__content').each((i, element) => {
        // Save an empty result object
        const result = {};
  
        // Save title as property of result object
        result.title = $(element)
          .find('h1')
          .text();

        // Scraped image
        result.img = $(element)
          .find('img-wrapper picture')
          .children()
          .first()
          .attr('data-srcset');

        // Scraped link to the full article  
        result.link = $(element)
          .find('.headline a')  
          .attr('href')

        // Scraped summary of the article
        result.summary = $(element)
          .find('.excerpt')
          .first()
          .text();
        
        // Check to see if an article is already in the database, and will only create a new one if it can't find the title
        db.Article.update({ title: result.title}, { $set: result}, { upsert: true }).catch(
            err => res.send(err)
        );
      });
    })
    .then(() => {
        // Send all articles to be rendered to the DOM
        db.Article.find()
        .then(dbArticles => {
            res.json(dbArticles);
        })
        .catch(err => res.send(err));
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
