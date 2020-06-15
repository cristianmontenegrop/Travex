const PORT = process.env.PORT || 3306;
require('dotenv').config();

const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  FacebookStrategy = require("passport-facebook").Strategy,
  GitHubStrategy = require("passport-github").Strategy,
  GoogleStrategy = require("passport-google-oauth2").Strategy;

const db = require("../models");

// Telling passport we want to use a Local Strategy. In other words, we want login with a username/email and password
passport.use(
  new LocalStrategy(
    // Our user will sign in using a "username"
    {
      usernameField: "username",
    },
    (username, password, done) => {
      // When a user tries to sign in this code runs
      db.User.findOne({
        where: {
          username: username
        }
      }).then((dbUser) => {
        // If there's no user with the given username
        if (!dbUser) {
          return done(null, false, {
            message: "Incorrect email.",
          });
        }
        // If there is a user with the given username, but the password the user gives us is incorrect
        else if (!dbUser.validPassword(password)) {
          return done(null, false, {
            message: "Incorrect password.",
          });
        }
        // If none of the above, return the user
        return done(null, dbUser);
      });
    }
  )
);
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_APP_ID,
//       clientSecret: process.env.FACEBOOK_APP_SECRET,
//       callbackURL: "https://travexproject.herokuapp.com/auth/facebook/callback",
//       // profileFields: ['id', 'displayName', 'photos', 'email']
//     },
//     (accessToken, refreshToken, profile, cb) => {
//       db.User.findOrCreate({ facebookId: profile.id }, (err, user) => {
//         if (err) {
//           return cb(err);
//         }
//         console.log(user);
//         cb(null, user);
//       });
//     }
//   )
// );

// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: process.env.GITHUB_APP_ID,
//       clientSecret: process.env.GITHUB_APP_SECRET,
//       callbackURL: "http://localhost:8080/auth",
//     },
//     (accessToken, refreshToken, profile, cb) => {
//       db.User.findOrCreate({ githubId: profile.id }, (err, user) => {
//         return cb(err, user);
//       });
//     }
//   )
// );

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:8080/auth/google/callback",
//       passReqtoCallback : true
//     },
//     function (request, accessToken, refreshToken, profile, cb) {
//       db.User.findOrCreate({ googleId: profile.id }, function (err, user) {
//         // return cb(err, user)
//         // console.log(profile)
//         return cb(err, user);
//       });
//     }
//   )
// );

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

// Exporting our configured passport
module.exports = passport;
