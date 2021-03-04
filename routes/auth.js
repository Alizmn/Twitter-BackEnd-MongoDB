const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../db/Schema/userSchema");
require("dotenv").config();

router.post("/login", (req, res, next) => {
  if (req.headers.authorization) {
    res.json({ msg: "You are already in, logout first!" }); // <-------- If Header is avaialable, user can't login again!
  } else {
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          msg: info ? info.message : "Login failed",
          user: user,
        });
      }

      req.login(user, { session: false }, (err) => {
        if (err) {
          res.send(err);
        }

        let userData = {
          id: user._id,
          admin: user.admin,
          username: user.username,
        };
        const token = jwt.sign(userData, process.env.JWT_SECRET, {
          expiresIn: process.env.EXPIRE,
        });

        return res.json({ token, user });
      });
    })(req, res);
  }
});

router.post("/register", (req, res, next) => {
  if (req.headers.authorization) {
    res.json({ msg: "You are already in, logout first!" }); // <-------- If Header is avaialable, user can't register!
  } else {
    const { username, name, email, password } = req.body;
    if (!username || !name || !email || !password) {
      res.status(406).json({ msg: "Please provide all the requierd fields" });
    }
    const newUser = {
      username,
      name,
      email,
      password,
    };

    User.findOne({ username: req.body.username })
      .then((user) => {
        if (!user) {
          User.findOne({ email: req.body.email })
            .then((user) => {
              if (!user) {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                  newUser.password = hash;
                  User.create(newUser)
                    .then(() => res.json({ msg: "created successfully" }))
                    .catch((err) => res.send(err));
                });
              } else {
                res.json({ msg: "email already used" });
              }
            })
            .catch((err) => res.send(err));
        } else {
          res.json({ msg: "username already exist" });
        }
      })
      .catch((err) => res.send(err));
  }
});

module.exports = router;
