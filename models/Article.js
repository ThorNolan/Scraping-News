const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
const ArticleSchema = new Schema({
  // `title` is a string that is required and unique in my db
  title: {
    type: String,
    required: true,
    unique: true
  },
  // `link` is string that is required and unique
  link: {
    type: String,
    required: true,
    unique: true
  },
  // `summary` is a string that is required and unique
  summary: {
    type: String,
    required: true,
    unique: true
  },
  // `note` is an array of objects that stores Note id's
  note: [{
    type: Schema.Types.ObjectId,
    ref: 'Note'
  }]
});

// This creates our model from the above schema, using mongoose's model method
const Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;