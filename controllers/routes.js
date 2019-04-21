// Require my dependencies
const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../models')
const express = require('express');
const exphbs = require('express-handlebars');

// Establish express router connection for export
const router = express.Router();

//============= HTML ROUTES ====================================================================    

  // Root route to render my index page
  router.get('/', (req, res) => {
    res.render('index');
  });

//============= API ROUTES ====================================================================    

  // A GET route for scraping the onion website for articles
  router.get('/scrape', (req, res) => {
    // Grab body html with axios, used news-in-brief page because of more consistent elements
    axios.get('https://www.theonion.com/c/news-in-brief').then(response => {
      // Load response into cheerio and store in local variable for a shorthand selector
      const $ = cheerio.load(response.data);
  
      // Grab every div with the class .item_content
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
        // Redirect to root route to display the index page
        res.redirect('/');
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
  
  // Route for grabbing a specific Article by id and populating it with it's new note
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
      return db.Article.findOneAndUpdate({
          _id: req.params.id
        }, { 
          note: dbNote._id
        }, { 
          safe: true,  
          new: true, 
          upsert: true
        });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
  });

  // Route for getting all notes for a particular article and returning them to the browser to display
  router.get("/notes/:id", (req, res) => {
    db.Note.findById({ _id: req.params.id })
    .then(function(dbNote) {
      res.json(dbNote)
    })
    .catch(function(err) {
      res.json(err);
    });
  })

  // Route for deleting an existing note
  router.delete("articles/:id/:noteid", (req, res) => {
      db.Note.findByIdAndRemove(req.params.noteid, function(error, doc) {
          if (error) {
              console.log(error);
          } else {
              db.Note.findOneAndUpdate({
                _id: req.params.id
              }, {
                 $pull: {
                    note: doc._id
                 } 
              })
              .exec(function (err, doc) {
                  if (err) {
                    console.log(err);
                  }
              });
          };
      });
  });

// Export router for use from my server  
module.exports = router;
