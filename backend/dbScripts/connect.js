const mysql = require("mysql2");
require("dotenv").config();
const options = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true,
};

let connection = mysql.createConnection(options);
module.exports = connection;
