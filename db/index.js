const mongoose = require("mongoose");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

const url = `mongodb+srv://${config.username}:${config.password}@kraken.2r52h.mongodb.net/${config.dbName}?retryWrites=true&w=majority`;

const connectionParams = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

module.exports = mongoose
  .connect(url, connectionParams)
  .then(() => {
    console.log(`Connected to ${config.dbName} database `);
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });
