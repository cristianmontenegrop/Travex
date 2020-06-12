// Requiring path to so we can use relative routes to our HTML files
const path = require("path");

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  app.get("/", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  app.get("/login", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/members.html"));
  });
};


// ===================================================
// ===================================================
// Need Routes for setting up API calls from the database
// ===================================================
// ===================================================

// Wikipedia
// ==================================================

// Unsplash Pictures
// ==================================================
var country;
picture_array = [];

function upSplashAJAX(country) {
  var Picurl = 'https://api.unsplash.com/search/photos?client_id=l_ucLpuaVqeosGc7xD0pKg6Ib61kn737l_M3-nkFmZY&query=' + country;
  $.ajax({
    url: Picurl,
    method: "GET"
  })
  .then(function (results) {
    var countryPic = results.results[0].urls.small
    picture_array.push(countryPic)
  })
}


app.get("/members/:id", function (req, res){
  //get 
  db.Itinerary.findOne({
    where: {
      User_id: req.params.id
    }
  }).then(function(dbItinerary){
    console.log(res.json(dbItinerary))
    country = res.json(dbItinerary.country)
    upSplashAJAX(country)
  
  })
})


// Exchange rate calculator
// ==================================================



// Open Trip Map
// ==================================================


app.get("/", (req, res) => {
  // If the user already has an account send them to the members page
  if (req.user) {
    res.redirect("/members");
  }
  // Static HTML 
  res.sendFile(path.join(__dirname, "../public/signup.html"));

  // Needs to be converted to Handlebars.js


});


// Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, (req, res) => {

    // Statis HTML
    res.sendFile(path.join(__dirname, "../public/members.html"));

    // Needs to be converted to Handlebars.js


  });