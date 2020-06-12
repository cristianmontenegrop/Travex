const PORT = process.env.PORT || 3306;

const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  FacebookStrategy = require("passport-facebook").Strategy
  // GitHubStrategy = require("passport-github").Strategy,
  // GoogleStrategy = require("passport-google-oauth").OAuthStrategy
  ;

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
      }).then(dbUser => {
        // If there's no user with the given email
        if (!dbUser) {
          return done(null, false, {
            message: "Incorrect email."
          });
        }
        // If there is a user with the given email, but the password the user gives us is incorrect
        else if (!dbUser.validPassword(password)) {
          return done(null, false, {
            message: "Incorrect password."
          });
        }
        // If none of the above, return the user
        return done(null, dbUser);
      });
    }
  )
);
passport.use(
  new FacebookStrategy(
    {
      clientID: "2597657447149490",
      clientSecret: "a8b7528e08ae763f11783464dbe335a3",
      callbackURL: "https://travexproject.herokuapp.com/auth/facebook/callback"
      // profileFields: ['id', 'displayName', 'photos', 'email']
    },
    (accessToken, refreshToken, profile, cb) => {
      User.findOrCreate({ facebookId: profile.id }, (err, user) => {
        return cb(err, user);
      });
    }
  )
);

// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: GITHUB_CLIENT_ID,
//       clientSecret: GITHUB_CLIENT_SECRET,
//       callbackURL: "http://127.0.0.1:" + PORT + "/auth/github/callback"
//     },
//     (accessToken, refreshToken, profile, cb) => {
//       User.findOrCreate({ githubId: profile.id }, (err, user) => {
//         return cb(err, user);
//       });
//     }
//   )
// );

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: GOOGLE_CLIENT_ID,
//       clientSecret: GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://www.example.com/auth/google/callback"
//       // clientID:
//       //   "595606650638-04ugaq25i1gtsm3aqg74c6f4h085incb.apps.googleusercontent.com",
//       // clientSecret: "TUjbOyiUaFvnWvgQFeFi_a6j",
//       // callbackURL: "http://localhost:8080/google/callback"
//     },
//     (accessToken, refreshToken, profile, cb) => {
//       User.findOrCreate({ googleId: profile.id }, (err, user) => {
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
