// Requiring path to so we can use relative routes to our HTML files
const path = require("path");
const db = require("../models");
const passport = require('passport')

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {

  // Homepage
  app.get("/", (req, res) => {
    // If the user already has an account send them to the their page
    if (req.user) {
      res.redirect("/userDashboard");
    }
    res.render("index", { title: "TravExpress | Explore"});
  });

  // Login Page
  app.get("/login", (req, res) => {
    // If the user already has an account send them to the their page
    if (req.user) {
      res.redirect("/userDashboard");
    }
    res.render("login", { title: "TravExpress | Login"});
  });

  // Login Page
  app.get("/signup", (req, res) => {
    // If the user already has an account send them to the their page
    if (req.user) {
      res.redirect("/userDashboard");
    }
    res.render("signup", { title: "TravExpress | Signup"});
  });

  // ===================================================
  // ===================================================
  // Need Routes for setting up API calls from the database
  // ===================================================
  // ===================================================

  // Logout Page
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/userDashboard", isAuthenticated, (req, res) => {
    res.render("userDashboard", { title: "TravExpress | Explore"});
  });

  app.get('/auth/github', passport.authenticate('github'))
  app.get('/auth', passport.authenticate('github', {
    successRedirect: '/userDashboard',
    failureRedirect: '/failed'
  }))

  app.get("/failed", (req, res) => {
    res.render("failed");
  });

  app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }))
  app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
    (req, res) => {
      res.redirect('/')
    })
};
