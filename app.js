/**
 *
 * REST-ful API for PET Shelter:
 * - express 4
 * - sqlite 3
 *
 * (c) 2018 StreetCoder
 * Author: StreetCoder <streetkoder@gmail.com>
 *
 */

var express = require('express')
var app = express()
var port = process.env.PORT || 8080;
var bodyparser = require('body-parser');
var sqlite3 = require('sqlite3').verbose()


app.use(bodyparser.urlencoded({extended: false}));


//  database
// -----------------------------------------------------------------------------

var db = new sqlite3.Database('./petShelterApi.db')
var db_ready = false;

var sql_create_table =
    'CREATE TABLE pets ( ' +
    '  id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
    '  name VARCHAR(255), ' +
    '  type VARCHAR(255), ' +
    '  breed VARCHAR(255), ' +
    '  location VARCHAR(255), ' +
    '  latitude VARCHAR(255), ' +
    '  longitude VARCHAR(255), ' +
    '  created INTEGER, ' +
    '  updated INTEGER ' +
    '); ';

db.run(sql_create_table, function () {
    db_ready = true;
});




// var now = new Date().getTime() / 1000 >> 0;
// var params = [ 'Banshee', 'Cat','Brittany', 'Boston, MA', '1.3241231','1.3241234', now, now ];
// db.run('INSERT INTO pets (name,type,breed,location, latitude, longitude, created, updated) VALUES(?,?,?,?,?,?,?,?)', params, function () {
//     var id = parseInt(this.lastID);
// });
//
// db.run('', function () {
//     db_ready = true;
// });

// insert into pets (name, type, breed, location, latitude, longitude) values ('Cherry', 'rithmic', 'Barbet', 'Saskatoon', '1.23123123', '2.24234234')
// seeds
//insert into pets (name, type, breed, location, latitude, longitude) values ('Cherry', 'rithmic', 'Barbet', 'Saskatoon', '1.23123123', '2.24234234');

//insert into pets (name, type, breed, location, latitude, longitude)
// values ('Apache', 'deshi', 'Canaan', 'Regina', '12.23123123', '12.24234234');


//  custom middleware
// -----------------------------------------------------------------------------
// Create middleware that gets called during every request.
app.use(function (req, res, next) {
    // This is going to be false until the the CREATE TABLE query has completed.
    if (db_ready) {
        // expose 'db' to the 'req' object, which follows the request
        req.db = db;

        // pass control off to the next route, also returning (the value of the
        // return does not matter) to ensure that it does not fall through to
        // the call to res.send(), telling the user that the db is not ready yet
        return next();
    }

    // Error out if the database is not ready yet.
    res.send('Database not setup yet!');
});



// return all pets in json format
app.get('/api/pets', function(req, res){
    db.all("SELECT * FROM pets", function(err, rows){
        res.json(rows);
        //res.json({ "pets" : rows });
    });
});

// Create a pet
app.post('/api/pets', function (req, res) {

    var now = new Date().getTime() / 1000 >> 0;
    var params = [ req.body.name, req.body.type, req.body.breed, req.body.location, req.body.latitude,req.body.longitude, now, now ];

    db.run('INSERT INTO pets (name,type,breed,location, latitude, longitude, created, updated) VALUES(?,?,?,?,?,?,?,?)', params, function (err) {

        if (err)
            res.send(err);

        res.json({ message: 'pet created!' });

    });

});

app.listen(port, () => console.log('Example app listening on port 8080!'))
