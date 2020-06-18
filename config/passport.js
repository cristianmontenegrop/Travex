const PORT = process.env.PORT || 8080;
require("dotenv").config();

const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  FacebookStrategy = require("passport-facebook").Strategy,
  GitHubStrategy = require("passport-github").Strategy,
  GoogleStrategy = require("passport-google-oauth20").Strategy;

const db = require("../models");

// Telling passport we want to use a Local Strategy. In other words, we want login with a username/email and password
passport.use(
  new LocalStrategy(
    // Our user will sign in using an email, rather than a "username"
    {
      usernameField: "username"
    },
    (username, password, done) => {
      // When a user tries to sign in this code runs
      db.User.findOne({
        where: {
          username: username
        }
      })
        .then(dbUser => {
          console.log("LOCAL STRATEGY");
          // If there's no user with the given email
          if (!dbUser) {
            console.log("Incorrect email.");
            return done(null, false, {
              message: "Incorrect email."
            });
          }
          // If there is a user with the given email, but the password the user gives us is incorrect
          else if (!dbUser.validPassword(password)) {
            console.log("Incorrect password.");
            return done(null, false, {
              message: "Incorrect password."
            });
          }
          // If none of the above, return the user
          return done(null, dbUser);
        })
        .catch(err => {
          console.log(err);
          return done(err, null);
        });
    }
  )
);
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: "https://travexproject.herokuapp.com/facebook/callback",
      callbackURL: "http://localhost:" + PORT + "/facebook/callback"
      // profileFields: ["id", "displayName", "name", "photos", "email"]
    },
    (accessToken, refreshToken, profile, cb) => {
      db.User.findOrCreate({
        where: { facebookId: profile.id },
        defaults: {
          first: profile.name.givenName,
          last: profile.name.familyName,
          facebookId: profile.id,
          username: profile.id,
          password: "facebookId"
        }
      }).then(user => {
        return cb(null, user[0]);
      });
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT,
      clientSecret: process.env.GITHUB_SECRET,
      // callbackURL: "https://travexproject.herokuapp.com/github/callback"
      callbackURL: "http://localhost:" + PORT + "/github/callback"
    },
    (accessToken, refreshToken, profile, cb) => {
      db.User.findOrCreate({
        where: { githubId: profile.id },
        defaults: {
          first: profile.displayName,
          last: ".",
          githubId: profile.id,
          username: profile.id,
          password: "githubId"
        }
      }).then(user => {
        return cb(null, user[0]);
      });
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT,
      clientSecret: process.env.GOOGLE_SECRET,
      // callbackURL: "https://travexproject.herokuapp.com/google/callback"
      callbackURL: "http://localhost:" + PORT + "/google/callback"
    },
    (accessToken, refreshToken, profile, cb) => {
      db.User.findOrCreate({
        where: { googleId: profile.id },
        defaults: {
          first: profile.name.givenName,
          last: profile.name.familyName,
          googleId: profile.id,
          username: profile.id,
          password: "googleId"
        }
      }).then(user => {
        return cb(null, user[0]);
      });
    }
  )
);

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work
passport.serializeUser((user, cb) => {
  console.log("serializeUser");
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  console.log("deserializeUser");
  cb(null, obj);
});

// Exporting our configured passport
module.exports = passport;
