Scraping News
=============================================
This app allows users to view and comment on news articles from [The Onion](https://www.theonion.com/) (America's Finest News Source). It utilizes the NPM packages Cheerio and Mongoose to scrape breaking (fake) news from The Onion and render it to the page from my Node server using Express routing. Data is stored in a MongoDB database, so all user comments are visible on each article and stored permanently until deleted! 

![demo gif](INSERT DEMO GIF HERE "Demo gif of the news scraper")

## 🔑 How to Use the App:

This app is very straightforward to use and requires little explanation.

+ Press the "Scrape News" button in the navbar to get new articles rendered to the page. 
  
+ Press the "Add Comment" button to add a comment to a specific article.

+ Press the "Delete Comment" button to delete a comment from the article and database.
   
+ That's it!

## 📁 Deployment Instructions

This app has been deployed to Heroku, and the link can be found [here](https://safe-bayou-15275.herokuapp.com/ "live link"). If you would like to run the app locally, follow these instructions: 

1. Clone this repository down to your machine.
   
2. You will need to have [Node.js](https://nodejs.org/en/) and [MongoDB](https://www.mongodb.com/) installed in order to continue. With MongoDB installed, you will need to run `mongod` in your CLI to initiate the database.
   
3. Enter `npm install` in your command line after navigating into the root directory, which will install the dependencies listed in the package.json.
   
4. Enter `node server.js`, which will initiate the server on http://localhost:3306.
   
5. Navigate to http://localhost:3306 in your browser, or ctrl-click the link that will be logged to your console. Enjoy!

## 🔧 Technologies Used  

+ **HTML5** and **CSS3** for page content and styling.

+ **Materialize.css** as a CSS framework for some additional styles.

+ **JavaScript** for the app's logic.
  
+ **Node.JS** for the app's server environment.

+ **NPM** for installation of the packages required by the app.
  + **Express**
  + **Express-Handlebars**
  + **Cheerio**
  + **Mongoose**
  + **Morgan**
  + **Axios**
  
+ **MongoDB** for database creation and data persistence.
  
+ **Heroku** for live deployment and hosting.

## 🌌 Author 

Thor Nolan—https://github.com/ThorNolan
