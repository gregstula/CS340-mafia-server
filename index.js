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


// Individuals
app.post('/individuals/create', (req, res) => {
	const {firstName, lastName, age} = req.body;
    db.query('INSERT INTO `Individuals` (`firstName`, `lastName`, `age`, `mafiaFamily`, `mafiaRole`) VALUES (?, ?, ?, NULL, NULL);',
        [firstName, lastName, age],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Individual successfully inserted!");
            }
        }
    );
});

app.get('/individuals', (req, res) => {
	db.query('SELECT * FROM Individuals LEFT JOIN Families ON Individuals.mafiaFamily = Families.familyID', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

//business subtable
app.get('/individuals/getBusinesses/:id', (req, res) => {
  db.query('SELECT businessID, businessName, buildingNumber, streetName, city, state, zip, familyName FROM Businesses LEFT JOIN Individuals ON individualID = individualOwner LEFT JOIN Families ON familyOwner = familyID WHERE individualID = ?;',
    req.params.id,
    (err, result) => {
      if (err) {
          console.log(err);
      } else {
          res.send(result);
      }
    }
  );
});

app.get('/individuals/searchBusinesses/:searchInput', (req, res) => {
  db.query('SELECT businessID, businessName, city, state, firstName, lastName, familyName FROM Businesses LEFT JOIN Individuals ON individualOwner = individualID LEFT JOIN Families ON familyOwner = familyID WHERE Businesses.businessName LIKE ?', "%" + req.params.searchInput + "%", (err, result) => {
    if(err)
      console.log(err);
    else
      res.send(result);
  })
})

app.put('/individuals/setBusinessOwner/:bID/:pID', (req, res) => {
  const busID = req.params.bID;
  const perID = req.params.pID;
  db.query('UPDATE Businesses SET individualOwner = ? WHERE Businesses.businessID = ?;', [perID, busID], (err, result) => {
    if(err)
      console.log(err);
    else
      res.send("individual owner set");
  });
});

app.delete('/individuals/setBusinessOwnerToNull/:id', (req, res) => {
  const id = req.params.id;
  console.log("setting business " + id + "'s owner to null");
  db.query('UPDATE Businesses SET individualOwner = null WHERE Businesses.businessID = ?;', id,
    (err, result) => {
      if(err)
        console.log(err);
      else
        res.send("Business no longer has individual owner");
    }
  )
});

app.put('/individuals/update/:id', (req, res) => {
	const {firstName, lastName, age} = req.body;
    const id = req.params.id;
    db.query('UPDATE Individuals SET firstName = ?, lastName = ?, age = ? WHERE individualID = ?;',
      [firstName, lastName, age, id],
      (err, result) => {
          if (err) {
              console.log(err);
          } else {
              res.send("Individual updated successfully!");
          }
      }
    );
});

app.delete('/individuals/delete/:id', (req, res) => {
  const id = req.params.id;
  console.log("deleting individual where id = " + id);
  db.query("DELETE FROM Individuals WHERE individualID = ?", id, (err, result) => {
	if (err) {
	  console.log(err);
	} else {
	  res.send("Individual deleted.");
	}
  });
});


// Businesses
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
