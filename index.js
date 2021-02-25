const express = require('express');
const app = express();
const mysql = require('mysql');
const db = mysql.createConnection({
    user: "bde25e105415bc",
    password: "9d786746",
    host: "us-cdbr-east-03.cleardb.com",
    database: "heroku_da400718f3a8859"
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port, () => {
    console.log("server works");
});


