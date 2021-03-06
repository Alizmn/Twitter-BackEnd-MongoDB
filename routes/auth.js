const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../db/Schema/userSchema");
require("dotenv").config();

// ------------------------LOGIN ENDPOINT----------------
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

// ------------------------REGISTER ENDPOINT----------------
router.post("/register", (req, res, next) => {
  if (req.headers.authorization) {
    res.json({ msg: "You are already in, logout first!" }); // <-------- If Header is avaialable, user can't register!
  } else {
    const { username, name, email, password } = req.body;
    if (!username || !name || !email || !password) {
      res.status(406).json({ msg: "Please provide all the requierd fields" });
    } else {
      const newUser = {
        username: username.toLowerCase(),
        name,
        email: email.toLowerCase(),
        password,
      };

      User.findOne({ username: newUser.username })
        .then((user) => {
          if (!user) {
            User.findOne({ email: newUser.email })
              .then((user) => {
                if (!user) {
                  bcrypt.hash(newUser.password, 10, (err, hash) => {
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
  }
});

// ------------------------USER ENDPOINT----------------
router.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  // ^----------------------------------------------------It's good to have this one although it's not in use now
  async (req, res) => {
    try {
      const user = await User.findOne({ username: req.user.username });
      res.send({ success: true, account: user });
    } catch (error) {
      res.status(500).json({ success: false, msg: "Error getting account" });
    }
  }
);

module.exports = router;
