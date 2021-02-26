const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require("cors");

app.use(cors());
app.use(express.json());

var corsOptions = {
    origin: 'https://gregstula.github.io',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

const db = mysql.createPool({
    user: "bde25e105415bc",
    password: "9d786746",
    host: "us-cdbr-east-03.cleardb.com",
    database: "heroku_da400718f3a8859"
});

db.on("error", (err) => {
    console.log('Server error: ' + err.toString());
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
    const buildingNumberInput = req.body.buildingNumberInput;
    const streetInput = req.body.streetInput;
    const cityInput = req.body.cityInput;
    const stateInput = req.body.stateInput;
    const zipInput = req.body.zipInput;

    db.query('INSERT INTO `Businesses` (`businessName`, `buildingNumber`, `streetName`, `city`, `state`, `zip`) VALUES (?, ?, ?, ?, ?, ?);',
        [businessNameInput, buildingNumberInput, streetInput, cityInput, stateInput, zipInput],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Business values successfully inserted!");
            }
        }
    );
});


app.delete("businesses/delete/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM Businesses WHERE businessID = ?", [id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});


app.get('/businesses', (req, res) => {
    db.query('select * from Businesses', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
});
