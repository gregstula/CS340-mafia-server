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
  const { firstName, lastName, age, mafiaFamily, mafiaRole } = req.body;
  db.query('INSERT INTO `Individuals` (`firstName`, `lastName`, `age`, `mafiaFamily`, `mafiaRole`) VALUES (?, ?, ?, (SELECT familyID FROM Families WHERE familyName = ?), ?);',
    [firstName, lastName, age, mafiaFamily, mafiaRole],
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

app.get('/individuals/:searchTerm', (req, res) => {
  var searchTerm = "%" + req.params.searchTerm + "%";
  db.query('SELECT * FROM Individuals LEFT JOIN Families ON Individuals.mafiaFamily = Families.familyID WHERE firstName LIKE ? OR lastName LIKE ?', [searchTerm, searchTerm], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
})

app.put('/individuals/update/:id', (req, res) => {
  const { firstName, lastName, age, mafiaFamily, mafiaRole } = req.body;
  const id = req.params.id;
  db.query('UPDATE Individuals SET firstName = ?, lastName = ?, age = ?, mafiaFamily = (SELECT familyID FROM Families WHERE familyName = ?), mafiaRole = ? WHERE individualID = ?;',
    [firstName, lastName, age, mafiaFamily, mafiaRole, id],
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
  db.query("DELETE FROM Individuals WHERE individualID = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send("Individual deleted.");
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
    if (err)
      console.log(err);
    else
      res.send(result);
  })
})

app.put('/individuals/setBusinessOwner/:bID/:pID', (req, res) => {
  const busID = req.params.bID;
  const perID = req.params.pID;
  db.query('UPDATE Businesses SET individualOwner = ? WHERE Businesses.businessID = ?;', [perID, busID], (err, result) => {
    if (err)
      console.log(err);
    else
      res.send("individual owner set");
  });
});

app.put('/individuals/setBusinessOwnerToNull/:id', (req, res) => {
  const id = req.params.id;
  console.log("setting business " + id + "'s owner to null");
  db.query('UPDATE Businesses SET individualOwner = null WHERE Businesses.businessID = ?;', id,
    (err, result) => {
      if (err)
        console.log(err);
      else
        res.send("Business no longer has individual owner");
    }
  )
});

//lawsBroken subtable
app.get('/individuals/getLawsBroken/:id', (req, res) => {
  var query = 'SELECT Laws.lawID, lawName, sentence';
  query += ' FROM Individuals';
  query += ' INNER JOIN LawsBrokenByIndividuals ON LawsBrokenByIndividuals.individualID = Individuals.individualID';
  query += ' INNER JOIN Laws ON LawsBrokenByIndividuals.lawID = Laws.lawID';
  query += ' WHERE Individuals.individualID = ?;';
  db.query(query,
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

app.get('/individuals/searchLaws/:searchInput', (req, res) => {
  var query = 'SELECT lawID, lawName, sentence';
  query += ' FROM Laws';
  query += ' WHERE lawName LIKE ?'
  db.query(query, "%" + req.params.searchInput + "%", (err, result) => {
    if (err)
      console.log(err);
    else
      res.send(result);
  })
});

app.put('/individuals/breakLaw/:lawID/:personID', (req, res) => {
  const lawID = req.params.lawID;
  const perID = req.params.personID;
  db.query('INSERT LawsBrokenByIndividuals (`lawID`, `individualID`, `count`) VALUES (?, ?, 1);', [lawID, perID], (err, result) => {
    if (err)
      console.log(err);
    else
      res.send("made person break law");
  });
});

app.delete('/individuals/unBreakLaw/:lawID/:personID', (req, res) => {
  const lawID = req.params.lawID;
  const perID = req.params.personID;
  db.query("DELETE FROM LawsBrokenByIndividuals WHERE lawID = ? AND individualID = ?", [lawID, perID], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send("Individual declared not guilty of crime");
    }
  });
});

// Businesses
app.post('/businesses/create', (req, res) => {

  const { businessName, buildingNumber, streetName, city, state, zip } = req.body;
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
  const { businessName, buildingNumber, streetName, city, state, zip } = req.body;
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


// Families
app.get('/families', (req, res) => {
  db.query('select familyID, familyName, count(mafiaFamily) as memberCount from families left join individuals on familyID = individuals.mafiaFamily group by familyID;', (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put('/families/update/:id', (req, res) => {
  const { familyName } = req.body;
  const id = req.params.id;
  db.query('UPDATE Families SET familyName = ? where familyID = ?',
    [familyName, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Family updated successfully!");
      }
    });
});

app.post('/families/create', (req, res) => {

  const { familyName } = req.body;
  db.query('INSERT INTO `Families` (`familyName`) VALUES (?);',
    [familyName],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Family values successfully inserted!");
      }
    }
  );
});

app.delete("/families/delete/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM Families WHERE familyID = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send("Business deleted.");
    }
  });
});


// Laws
app.get('/laws', (req, res) => {
  db.query('select * from Laws;', (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put('/laws/update/:id', (req, res) => {
  const { lawName, sentence } = req.body;
  const id = req.params.id;
  db.query('UPDATE Families SET lawName = ?, sentence = ? where lawID = ?',
    [lawName, sentence, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Law updated successfully!");
      }
    });
});


app.post('/laws/create', (req, res) => {

  const { lawName, sentence } = req.body;
  db.query('INSERT INTO `Laws` (`lawName, sentence`) VALUES (?, ?);',
    [lawName, sentence],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Law values successfully inserted!");
      }
    }
  );
});

app.delete("/laws/delete/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM Families WHERE lawID = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send("Business deleted.");
    }
  });
});