// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");

module.exports = function (app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      username: req.user.username,
      id: req.user.id
    });
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", (req, res) => {
    db.User.create({
      username: req.body.username,
      password: req.body.password,
      first: req.body.first,
      last: req.body.last
    })
      .then(() => {
        res.redirect(307, "/api/login");
      })
      .catch(err => {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's username and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        username: req.user.username,
        id: req.user.id
      });
    }
  });

  // Cris's realm

  // Local strategy


  // Facebook strategy
  app.get("/auth/facebook", passport.authenticate("facebook"));

  app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
      successRedirect: "/",
      failureRedirect: "/login"
    })
  );
  // 

  // AXIOS
  // ======================================================================
  const axios = require('axios');  


  app.get("/api/things-to-do/:country:city", function(req, res) {
    var country = req.params.country;
    var city = req.params.city;
    apiKeyOTM = "5ae2e3f221c38a28845f05b63bcb2439d3637d8dfb5b37ef5e47b686";
    axiosOTM(city);

    //Setup for OpenTripMap axios call:
    function axiosOTM(city){
        // First axios call gathers latitue and longitude based on city query
        var url = "https://api.opentripmap.com/0.1/en/places/geoname?name="+city+"&apikey="+apiKeyOTM+"";
        axios.get(url)
        .then((response)=>{
        console.log(response.data.lat, response.data.lon);
        var lat = response.data.lat;
        var lon = response.data.lon;
        console.log(lat);

        // Second axios call gathers 5 (can be set by limit) features within 10KM with a rating of 2 or higher; feature id is "xid"
        url = "https://api.opentripmap.com/0.1/en/places/radius?radius=10000&limit=5&offset=0&rate=2&format=json&lon="+lon+"&lat="+lat+"&apikey="+apiKeyOTM+"";
        axios.get(url)
        .then((response)=>{
        console.log(response.data[0]);
        console.log(response.data[0].xid);
        var xid = response.data[0].xid;
        url = "https://api.opentripmap.com/0.1/en/places/xid/"+xid+"?apikey="+apiKeyOTM+"";

        // Third axios call searches the feature id for a picture and description
        axios.get(url)
        .then((response)=>{
            console.log(response.data.image)
            console.log(response.data.wikipedia_extracts.text)
        })
        .catch((error)=>{
        console.log(error)
          })
         })
        })
    }
    // Almost there! Need to compile response datas in json object with 5 results and then res.json(axiosdata)
  
  })
};

  