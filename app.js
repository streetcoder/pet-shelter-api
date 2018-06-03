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

var db = new sqlite3.Database('./pet_shelter_api.db')
var db_ready = false;

var sql_create_table =
    'CREATE TABLE pets ( ' +
    '  id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
    '  name VARCHAR(255), ' +
    '  type VARCHAR(255), ' +
    '  breed VARCHAR(255), ' +
    '  latitude VARCHAR(255), ' +
    '  longitude VARCHAR(255), ' +
    '  created INTEGER, ' +
    '  updated INTEGER ' +
    '); ';

db.run(sql_create_table, function () {
    db_ready = true;
});

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
        if (err)
            res.json({ status: 'error', message:err });
        res.json(rows);
    });
});

// Create a pet
app.post('/api/pets', function (req, res) {

    db.all("select id from pets where name = '" + req.body.name + "' and breed = '" + req.body.breed + "'", [], function(err, row){

        if(row.length > 0){
            res.json({ status: 'error', message:'pet name and breed exist' });
        }
        else{
            var now = new Date().getTime() / 1000 >> 0;

            var params = [ req.body.name, req.body.type, req.body.breed, req.body.latitude,req.body.longitude, now, now ];
            db.run('INSERT INTO pets (name,type,breed, latitude, longitude, created, updated) VALUES(?,?,?,?,?,?,?)', params, function (err) {
                var id = parseInt(this.lastID);
                if (err)
                    res.json({ status: 'error', message:err });

                res.json({status: 'success', message: 'pet created successfully!', pet_id: id });

            });
        }
    });

});

// return individual pet information
app.get('/api/pet/:petId', function(req, res) {

    db.all("SELECT * FROM pets where id='" + req.params.petId + "'", function(err, rows){
        if(rows.length < 1){
            res.json({ status: 'error', message:'pet is not exist' });
        }else{
            res.json(rows);
        }
    });
});

app.listen(port, () => console.log('Example app listening on port 8080!'))
