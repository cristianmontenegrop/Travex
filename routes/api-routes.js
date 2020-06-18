// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");
const axios = require("axios");
// require("axios");
require("dotenv").config();
// const arr = [];
// const nameArr = [];
// const kindArr = [];
// const imgArr = [];
// const descriptionArr = [];
// const xidArr = [];

module.exports = function(app) {
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
        console.log("RES.REDIRECT, 307");
        res.redirect(307, "/api/login");
      })
      .catch(err => {
        console.log("ERROR IN API/SIGNUP");
        res.status(401).json(err);
      });
  });

  app.post("/api/activities", (req, res) => {
    console.log("This is req.body:", req.body);
    console.log("Country is:", req.body.Country);

    db.activities
      .create({
        // eslint-disable-next-line camelcase
        User_id: req.body.User_id,
        Country: req.body.Country,
        City: req.body.City,
        ImageURL: req.body.ImageURL,
        Description: req.body.Description
      })
      .then(() => {
        // res.json({ "This": "Worked" });
        res.status(307);
      })
      .catch(err => {
        console.log(err);
        res.status(401).json(err);
      });
  });

  app.get("/api/activities/:id", (req, res) => {
    const loginId = req.params.id;
    console.log("userId:", loginId);
    db.activities
      .findAll({
        where: {
          // eslint-disable-next-line camelcase
          User_id: loginId
        }
      })
      .then(data => {
        console.log(data);
        res.json(data);
      });
  });

  app.get("/api/user_data", (req, res) => {
    console.log();
    if (!req.user) {
      res.json({});
    } else {
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
    const city = req.params.city;
    console.log("city:", city);
    apiKeyOTM = process.env.OTM_APIKEY;
    let url =
      "https://api.opentripmap.com/0.1/en/places/geoname?name=" +
      city +
      "&apikey=" +
      apiKeyOTM +
      "";
    axios
      .get(url)
      .then(response => {
        console.log(response.data);
        console.log(response.data.lat, response.data.lon);
        let lat = response.data.lat;
        let lon = response.data.lon;
        let queryCity = response.data.name;
        let queryCountry = response.data.country;
        var arr = [];
        var nameArr = [];
        var kindArr = [];
        var imgArr = [];
        var descriptionArr = [];
        var xidArr = [];

        // Second axios call gathers features within 10KM with a rating of 2 or higher; feature id is "xid"
        url =
          "https://api.opentripmap.com/0.1/en/places/radius?radius=10000&limit=5&offset=0&rate=2&format=json&lon=" +
          lon +
          "&lat=" +
          lat +
          "&apikey=" +
          apiKeyOTM +
          "";
        axios.get(url).then(response => {
          for (let i = 0; i < 5; i++) {
            nameArr.push(response.data[i].name);
            kindArr.push(response.data[i].kinds);
            xidArr.push(response.data[i].xid);
          }
          url =
            "https://api.opentripmap.com/0.1/en/places/xid/" +
            xidArr[0] +
            "?apikey=" +
            apiKeyOTM +
            "";
          // Series of axios calls searches the feature ids for a pictures and descriptions and pushes them to an array
          axios.get(url).then(response => {
            image = response.data.preview.source;
            description = response.data.wikipedia_extracts.text;
            imgArr.push(image);
            descriptionArr.push(description);
            url =
              "https://api.opentripmap.com/0.1/en/places/xid/" +
              xidArr[1] +
              "?apikey=" +
              apiKeyOTM +
              "";
            axios.get(url).then(response => {
              image = response.data.preview.source;
              description = response.data.wikipedia_extracts.text;
              imgArr.push(image);
              descriptionArr.push(description);
              url =
                "https://api.opentripmap.com/0.1/en/places/xid/" +
                xidArr[2] +
                "?apikey=" +
                apiKeyOTM +
                "";
              axios.get(url).then(response => {
                image = response.data.preview.source;
                description = response.data.wikipedia_extracts.text;
                imgArr.push(image);
                descriptionArr.push(description);
                url =
                  "https://api.opentripmap.com/0.1/en/places/xid/" +
                  xidArr[3] +
                  "?apikey=" +
                  apiKeyOTM +
                  "";
                axios.get(url).then(response => {
                  image = response.data.preview.source;
                  description = response.data.wikipedia_extracts.text;
                  imgArr.push(image);
                  descriptionArr.push(description);
                  url =
                    "https://api.opentripmap.com/0.1/en/places/xid/" +
                    xidArr[4] +
                    "?apikey=" +
                    apiKeyOTM +
                    "";
                  axios
                    .get(url)
                    .then(response => {
                      image = response.data.preview.source;
                      description = response.data.wikipedia_extracts.text;
                      imgArr.push(image);
                      descriptionArr.push(description);
                      // push all the arrays into an object and back into a final array of objects;
                      for (let i = 0; i < 5; i++) {
                        const dataObj = {};
                        dataObj.city = queryCity;
                        dataObj.country = queryCountry;
                        dataObj.name = nameArr[i];
                        dataObj.kind = kindArr[i];
                        dataObj.image = imgArr[i];
                        dataObj.description = descriptionArr[i];
                        arr.push(dataObj);
                      }
                      // console.log(arr);
                      res.json(arr);
                    })
                    .catch(error => {
                      console.log(error);
                    });
                });
              });
            });
          });
        });
      })
      .catch(error => {
        console.log(error);
      });
  });
};
