require("dotenv").config();
const mongoose = require("mongoose");

const url = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@kraken.2r52h.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const connectionParams = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

module.exports = mongoose
  .connect(url, connectionParams)
  .then(() => {
    console.log(`Connected to ${process.env.DB_NAME} database `);
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });
