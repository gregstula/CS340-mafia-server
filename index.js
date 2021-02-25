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

// Business
app.post('/businesses/create', (req, res) => {

    const businessNameInput = req.body.businessNameInput;
    const buildingNumberIndput = req.body.businessNameInput;
    const streetInput = req.body.streetInput;
    const cityInput = req.body.cityInput;
    const stateInput = req.body.stateInput;
    const zipInput = req.body.zipInput;

    db.query('INSERT INTO `Businesses` (`businessName`, `buildingNumber`, `streetName`, `city`, `state`, `zip`) VALUES (?, ?, ?, ?, ?, ?);',
        [businessNameInput, buildingNumberIndput, streetInput, cityInput, stateInput, zipInput],
        (err, res) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Business values successfully inserted!");
            }
        }
    );
});
