const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const methodOverride = require("method-override");
require("./config/passport");
// --------------------------DEBUGING-----------------------
const logger = require("morgan");

// --------------------------ROUTERS-----------------------
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("trust proxy", true);
app.use(cors());
app.use(passport.initialize());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/auth", authRouter);

app.use("/users", usersRouter);

module.exports = app;
