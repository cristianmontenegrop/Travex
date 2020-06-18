// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");
const axios = require('axios');
require('dotenv').config()

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
        console.log("RES.REDIRECT, 307")
        res.redirect(307, "/api/login");
      })
      .catch(err => {
        console.log("ERROR IN API/SIGNUP")
        res.status(401).json(err);
      });
  });


  app.post("/api/activities", (req, res) => {
    console.log("This is req.body:",req.body);
    console.log("Country is:", req.body.Country);

    db.activities.create({
      User_id: req.body.User_id,
      Country: req.body.Country,
      City: req.body.City,
      ImageURL: req.body.ImageURL,
      Description: req.body.Description
    })      
      .then(() => {
        // res.json({ "This": "Worked" });
        res.status(307)
      })
      .catch(err => {
        console.log(err);
        res.status(401).json(err);
      });

  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    console.log()
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's username and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        username: req.user.username,
        id: req.user.id,
        first: req.user.first,
        last: req.user.last
      });
    }
  });

  //AXIOS
  app.get("/api/user_data/:city", (req, res) => {
    var city = req.params.city;
    console.log("city:", city);
    apiKeyOTM = process.env.OTM_APIKEY
    // axiosOTM(city);

    //Setup OpenTripMap axios call:
    // function axiosOTM(city) {
    // First axios call gathers latitue and longitude based on city query
    var url = "https://api.opentripmap.com/0.1/en/places/geoname?name=" + city + "&apikey=" + apiKeyOTM + "";
    axios.get(url)
      .then((response) => {
        console.log(response.data)
        console.log(response.data.lat, response.data.lon);
        var lat = response.data.lat;
        var lon = response.data.lon;
        var queryCity = response.data.name;
        var queryCountry = response.data.country;

        // Second axios call gathers features within 10KM with a rating of 2 or higher; feature id is "xid"
        url = "https://api.opentripmap.com/0.1/en/places/radius?radius=10000&limit=5&offset=0&rate=2&format=json&lon=" + lon + "&lat=" + lat + "&apikey=" + apiKeyOTM + "";
        axios.get(url)
          .then((response) => {
            var arr = [];
            var nameArr = [];
            var kindArr = [];
            var imgArr = [];
            var descriptionArr = [];
            var xidArr = []

            for (var i = 0; i < 5; i++) {
              nameArr.push(response.data[i].name)
              kindArr.push(response.data[i].kinds);
              xidArr.push(response.data[i].xid)
            }
            url = "https://api.opentripmap.com/0.1/en/places/xid/" + xidArr[0] + "?apikey=" + apiKeyOTM + "";

            // Series of axios calls searches the feature ids for a pictures and descriptions and pushes them to an array
            axios.get(url).then((response) => {
              // console.log(response.data);
              image = response.data.preview.source;
              description = response.data.wikipedia_extracts.text;
              imgArr.push(image);
              descriptionArr.push(description);
              url = "https://api.opentripmap.com/0.1/en/places/xid/" + xidArr[1] + "?apikey=" + apiKeyOTM + "";
              axios.get(url).then((response) => {
                image = response.data.preview.source;
                description = response.data.wikipedia_extracts.text;
                imgArr.push(image);
                descriptionArr.push(description);
                url = "https://api.opentripmap.com/0.1/en/places/xid/" + xidArr[2] + "?apikey=" + apiKeyOTM + "";
                axios.get(url).then((response) => {

                  image = response.data.preview.source;
                  description = response.data.wikipedia_extracts.text;
                  imgArr.push(image);
                  descriptionArr.push(description);
                  url = "https://api.opentripmap.com/0.1/en/places/xid/" + xidArr[3] + "?apikey=" + apiKeyOTM + "";
                  axios.get(url).then((response) => {
                    image = response.data.preview.source;
                    description = response.data.wikipedia_extracts.text;
                    imgArr.push(image);
                    descriptionArr.push(description);
                    url = "https://api.opentripmap.com/0.1/en/places/xid/" + xidArr[4] + "?apikey=" + apiKeyOTM + "";
                    axios.get(url).then((response) => {
                      image = response.data.preview.source;
                      description = response.data.wikipedia_extracts.text;
                      imgArr.push(image);
                      descriptionArr.push(description);
                      // push all the arrays into an object and back into a final array of objects;
                      for (var i = 0; i < 5; i++) {
                        var dataObj = {};
                        dataObj['city'] = queryCity
                        dataObj['country'] = queryCountry
                        dataObj['name'] = nameArr[i]
                        dataObj['kind'] = kindArr[i]
                        dataObj['image'] = imgArr[i]
                        dataObj['description'] = descriptionArr[i]
                        arr.push(dataObj);
                      }
                      // console.log(arr);
                      res.json(arr);
                      //                 // return arr;
                    })
                      .catch((error) => {
                        console.log(error)
                      })
                  })
                })
              })
            })
          })
      }).catch((error) => {
        console.log(error)
      });
    // }
    // res.json({"hello":"hello"})
  })

  //   // Google strategy
  //   app.get('/auth/google',
  //   passport.authenticate('google', { scope: 
  //       [ 'https://www.googleapis.com/auth/plus.login',
  //       , 'https://www.googleapis.com/auth/plus.profile.emails.read' ] }
  // ));

  //   app.get( '/auth/google/callback', 
  //       passport.authenticate( 'google', { 
  //           successRedirect: '/auth/google/success',
  //           failureRedirect: '/auth/google/failure'
  //   }));

  //   // Facebook strategy
  //   app.get("/auth/facebook", passport.authenticate("facebook"));

  // app.get(
  //   "/auth/facebook/callback",
  //   passport.authenticate("facebook", {
  //     successRedirect: "/",
  //     failureRedirect: "/login"
  //   })
  // );
  // 

  // AXIOS
  // ======================================================================
  const axios = require('axios');


  app.get("/api/things-to-do/:country:city", function (req, res) {
    var country = req.params.country;
    var city = req.params.city;
    apiKeyOTM = "5ae2e3f221c38a28845f05b63bcb2439d3637d8dfb5b37ef5e47b686";
    axiosOTM(city);

    //Setup for OpenTripMap axios call:
    function axiosOTM(city) {
      // First axios call gathers latitue and longitude based on city query
      var url = "https://api.opentripmap.com/0.1/en/places/geoname?name=" + city + "&apikey=" + apiKeyOTM + "";
      axios.get(url)
        .then((response) => {
          console.log(response.data.lat, response.data.lon);
          var lat = response.data.lat;
          var lon = response.data.lon;
          console.log(lat);

          // Second axios call gathers features within 10KM with a rating of 2 or higher; feature id is "xid"
          url = "https://api.opentripmap.com/0.1/en/places/radius?radius=10000&limit=5&offset=0&rate=2&format=json&lon=" + lon + "&lat=" + lat + "&apikey=" + apiKeyOTM + "";
          axios.get(url)
            .then((response) => {
              var arr = [];
              var nameArr = [];
              var kindArr = [];
              var imgArr = [];
              var descriptionArr = [];
              var xidArr = []

              for (var i = 0; i < 5; i++) {
                nameArr.push(response.data[i].name)
                kindArr.push(response.data[i].kinds);
                xidArr.push(response.data[i].xid)
              }
              url = "https://api.opentripmap.com/0.1/en/places/xid/" + xidArr[0] + "?apikey=" + apiKeyOTM + "";

              // Series of axios calls searches the feature ids for a pictures and descriptions and pushes them to an array
              axios.get(url).then((response) => {
                image = response.data.image;
                description = response.data.wikipedia_extracts.text;
                imgArr.push(image);
                descriptionArr.push(description);
                url = "https://api.opentripmap.com/0.1/en/places/xid/" + xidArr[1] + "?apikey=" + apiKeyOTM + "";
                axios.get(url).then((response) => {
                  image = response.data.image;
                  description = response.data.wikipedia_extracts.text;
                  imgArr.push(image);
                  descriptionArr.push(description);
                  url = "https://api.opentripmap.com/0.1/en/places/xid/" + xidArr[2] + "?apikey=" + apiKeyOTM + "";
                  axios.get(url).then((response) => {
                    image = response.data.image;
                    description = response.data.wikipedia_extracts.text;
                    imgArr.push(image);
                    descriptionArr.push(description);
                    url = "https://api.opentripmap.com/0.1/en/places/xid/" + xidArr[3] + "?apikey=" + apiKeyOTM + "";
                    axios.get(url).then((response) => {
                      image = response.data.image;
                      description = response.data.wikipedia_extracts.text;
                      imgArr.push(image);
                      descriptionArr.push(description);
                      url = "https://api.opentripmap.com/0.1/en/places/xid/" + xidArr[4] + "?apikey=" + apiKeyOTM + "";
                      axios.get(url).then((response) => {
                        image = response.data.image;
                        description = response.data.wikipedia_extracts.text;
                        imgArr.push(image);
                        descriptionArr.push(description);
                        // push all the arrays into an object and back into a final array of objects;
                        for (var i = 0; i < 5; i++) {
                          var dataObj = {};
                          dataObj['name'] = nameArr[i]
                          dataObj['kind'] = kindArr[i]
                          dataObj['image'] = imgArr[i]
                          dataObj['description'] = descriptionArr[i]
                          arr.push(dataObj);
                        }
                        console.log(arr);
                      })
                        .catch((error) => {
                          console.log(error)
                        })
                    })
                  })
                })
              })
            })
        })
    }
    // Almost there! We now have an array of objects to send somewhere
    res.json(arr);

  })
};


