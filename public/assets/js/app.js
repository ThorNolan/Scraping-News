//======= CLIENT-SIDE JAVASCRIPT =============================================================================

$(document).ready(function() {

  // Grab the articles as a json
  $.getJSON('/articles', function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Construct html to display the article information on the page
      $("#scraped-articles").prepend("<div class='result-div'><p class='result-text'><a href='" + data[i].link + "' target='_blank'>" + data[i].title + "</a></p>" + "<p>" + data[i].summary + "</p><button class='create-note btn waves-effect waves-light green darken-1 hvr-icon-bob hvr-sweep-to-top' data-id='" + data[i]._id + "' style='height: 45px'><i class='material-icons left valign-center hvr-icon'>add_comment</i>Add Comment</button></div><hr>");
    }
  });
  
  // Event handler for create note button for a particular article
  $(document).on("click", ".create-note", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        // console.log(data);

        // The title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");

        // The summary of the article
        $("#notes").append("<p>" + data.summary + "</p>")

        // Area for displaying notes with a button for deleting them
        $("#notes").append("<p id='noteArea'></p>")

        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");

        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button class='btn waves-effect waves-light green darken-1 hvr-sweep-to-top' data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        // If there's a note in the article
        if (data.note) {
          // Place the body of the note in the body textarea
          $("#noteArea").text(data.note.body);
          $("#noteArea").append("<button id='delete-note' class='btn btn-small waves-effect waves-light'>X</button>")
        }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
});