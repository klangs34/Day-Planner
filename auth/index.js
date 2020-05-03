const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../models");

passport.use(
  new LocalStrategy(function (username, password, next) {
    db.User.findOne({ username: username }, async function (err, user) {
      if (err) {
        return next({
          status: 400,
          message: "Invalid Email/Password",
        });
      }
      if (!user) {
        return next({
          status: 400,
          message: "Invalid Username",
        });
      }
      try {
        let isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return next({
            status: 401,
            message: "Invalid Password",
          });
        }
        return done(null, user);
      } catch (error) {
        return next({
          status: 402,
          message: "Invalid Email/Password",
        });
      }
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = passport;
