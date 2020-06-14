// Requiring path to so we can use relative routes to our HTML files
const path = require("path");
const db = require("../models");
const passport = require('passport')

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {
  app.get("/", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/index");
    }
    // res.sendFile(path.join(__dirname, "../public/login.html"));
    // Handlebars:
    res.render("login");
  });
  // app.get("/index", (req, res) => {
  //   // If the user already has an account send them to the members page
  //   // res.sendFile(path.join(__dirname, "../public/index.html"));
  //   // Handlebars:
  //   res.render("index");
  // });

  app.get("/login", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/index");
    }
    // res.sendFile(path.join(__dirname, "../public/login.html"));
    // Handlebars:
    res.render("login");
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/index", isAuthenticated, (req, res) => {
    // res.sendFile(path.join(__dirname, "../public/index.html"));
    // Handlebars:
    res.render("index");
  });

  app.get('/auth/github', passport.authenticate('github'))
  app.get('/auth', passport.authenticate('github', {
    successRedirect: '/index',
    failureRedirect: '/failed'
  }))

  app.get("/failed", isAuthenticated, (req, res) => {
    // res.sendFile(path.join(__dirname, "../public/index.html"));
    // Handlebars:
    res.render("failed");
  });

  app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }))
  app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
    (req, res) => {
      res.redirect('/')
    })
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
//   let country;
//   pictureArray = [];

//   function upSplashAJAX(country) {
//     const picURL =
//       "https://api.unsplash.com/search/photos?client_id=l_ucLpuaVqeosGc7xD0pKg6Ib61kn737l_M3-nkFmZY&query=" +
//       country;
//     $.ajax({
//       url: picURL,
//       method: "GET"
//     }).then(results => {
//       const countryPic = results.results[0].urls.small;
//       pictureArray.push(countryPic);
//     });
//   }

//   app.get("/members/:id", (req, res) => {
//     //get
//     db.activities
//       .findOne({
//         where: {
//           // eslint-disable-next-line camelcase
//           User_id: req.params.id
//         }
//       })
//       .then(dbactivities => {
//         console.log(res.json(dbactivities));
//         country = res.json(dbactivities.country);
//         upSplashAJAX(country);
//       });
//   });
// };
// Exchange rate calculator
// ==================================================

// Open Trip Map
// ==================================================