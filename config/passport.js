const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcrypt");
const User = require("../db/Schema/userSchema");
require("dotenv").config();

let login;

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      session: false,
    },
    function (email, password, done) {
      //  ^-----------------------------------it would be possible to login with both email or username
      if (email.split("").includes("@")) {
        login = { email: email.toLowerCase() };
      } else {
        login = { username: email.toLowerCase() };
      }
      User.findOne(login, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect email or password" });
        }

        bcrypt.compare(password, user.password, (err, match) => {
          if (err) {
            return done(null, false, { message: "something's wrong" });
          }

          if (!match) {
            return done(null, false, {
              message: "Incorrect email or password",
            });
          }

          return done(null, user);
        });
      });
    }
  )
);

passport.use(
  new JwtStrategy(
    // ^------------------------------this trategy is great to authorize the token and allow access
    {
      jwtFromRequest: ExtractJwt.fromHeader("authorization"),
      secretOrKey: process.env.JWT_SECRET,
    },
    function (jwtPayload, cb) {
      return User.findById(jwtPayload.id)
        .then((user) => {
          return cb(null, user);
        })
        .catch((err) => {
          return cb(err);
        });
    }
  )
);
