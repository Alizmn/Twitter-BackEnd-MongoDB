// This file define the parameter for developement and testing enviroment

require("dotenv").config();

module.exports = {
  development: {
    username: process.env.USER_NAME,
    password: process.env.PASSWORD,
    dbName: process.env.DB_NAME,
    port: process.env.PORT,
  },
  test: {
    username: process.env.USER_NAME,
    password: process.env.PASSWORD,
    dbName: process.env.DB_NAME_TEST,
    port: process.env.PORT_TEST,
  },
};
