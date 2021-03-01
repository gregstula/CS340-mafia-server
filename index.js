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

    const {businessName, buildingNumber, streetName, city, state, zip} = req.body;
    db.query('INSERT INTO `Businesses` (`businessName`, `buildingNumber`, `streetName`, `city`, `state`, `zip`) VALUES (?, ?, ?, ?, ?, ?);',
        [businessName, buildingNumber, streetName, city, state, zip],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Business values successfully inserted!");
            }
        }
    );
});


app.delete("/businesses/delete/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM Businesses WHERE businessID = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send("Business deleted.");
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
    });
});

app.put('/businesses/update/:id', (req, res) => {
    const {businessName, buildingNumber, streetName, city, state, zip} = req.body;
    const id = req.params.id;
    db.query('UPDATE Businesses SET businessName = ?, buildingNumber = ?, streetName = ?, city = ?, state = ?, zip = ? WHERE businessID = ?;',
    [businessName, buildingNumber, streetName, city, state, zip, id],
    (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send("Business updated successfully!");
        }
    });
});
