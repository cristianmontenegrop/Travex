// Requiring path to so we can use relative routes to our HTML files
// const path = require("path");
// const db = require("../models");
const passport = require("passport");

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  // Homepage
  app.get("/", (req, res) => {
    // If the user already has an account send them to the their page
    if (req.user) {
      res.render("userDashboard");
    }
    res.render("index", { title: "TravExpress | Explore" });
  });

  // Login Page
  app.get("/login", (req, res) => {
    // If the user already has an account send them to the their page
    if (req.user) {
      res.render("userDashboard");
    }
    res.render("login", { title: "TravExpress | Login" });
  });

  // Signup Page
  app.get("/signup", (req, res) => {
    // If the user already has an account send them to the their page
    if (req.user) {
      res.render("userDashboard");
    }
    res.render("signup", { title: "TravExpress | Signup" });
  });

  // Logout Page
  app.get("/logout", (req, res) => {
    req.logout();
    res.render("index");
  });

  app.get("/userDashboard", isAuthenticated, (req, res) => {
    res.render("userDashboard", { title: "TravExpress | Explore" });
  });

  app.get("/failed", (req, res) => {
    res.render("failed");
  });

  // FACEBOOK API
  app.get("/auth/facebook", passport.authenticate("facebook"));

  app.get(
    "/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/failed" }),
    (req, res) => {
      res.render("userDashboard", { title: "TravExpress | Explore" });
    }
  );

  // GITHUB API
  app.get("/auth/github", passport.authenticate("github"));
  app.get(
    "/github/callback",
    passport.authenticate("github", { failureRedirect: "/failed" }),
    (req, res) => {
      res.render("userDashboard", { title: "TravExpress | Explore" });
    }
  );

  // GOOGLE API
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile"] })
  );
  app.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/failed" }),
    (req, res) => {
      res.render("userDashboard", { title: "TravExpress | Explore" });
    }
  );
};
