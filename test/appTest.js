
process.env.NODE_ENV = 'test';

var sqlite3 = require('sqlite3').verbose();

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

chai.use(chaiHttp);

/*
 * Test the /GET route
 * Display all pets
 */
describe('/GET pets', function(){
    it('it should GET all the pets', function(done){
        chai.request(server)
            .get('/api/pets')
            .end(function(err, res){
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });
});

/*
* Test the /POST route
* Test case 1: check the required field
* Test case 2: POST the data of a pet
* */
describe('/POST pet', function() {
    // it('it should not POST a pet without required fields', function(done){
    //         var pet = {
    //             type: 'Dog',
    //             breed: 'Beagle',
    //             latitude: 42.3600826,
    //             longitude: -71.05888010000001
    //         };
    //         chai.request(server)
    //             .post('/api/pets')
    //             .send(pet)
    //             .end(function(err, res) {
    //             res.should.have.status(200);
    //             res.body.should.be.a('object');
    //             res.body.should.have.property('status').eql('error');
    //             res.body.errors.should.have.property('name');
    //             res.body.errors.name.should.have.property('kind').eql('required');
    //             done();
    //     });
    // });
    it('it should POST a pet ', function(done){
        var pet = {
                name: 'Ajaxis',
                type: 'Dog',
                breed: 'Beagle',
                latitude: 42.3600826,
                longitude: -71.05888010000001
        };
        chai.request(server)
            .post('/api/pets')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(pet)
            .end(function(err, res){
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status');
                res.body.should.have.property('message').eql('pet created successfully!');
                res.body.should.have.property('pet_id');
                done();
            });
    });
});


/*
* Test the /GET/:id route
* Display an individual Pet
*/
describe('/GET/:id pet', function(){
    it('it should GET a pet by the given id', function(done) {

        var db = new sqlite3.Database('./test/pet_shelter_api_test.db');
        var params = ['Banshee', 'Dog', 'Bittany', '40.7127753', '-74.0059728', '1528050776', '1528050776'];
        db.run('INSERT INTO pets (name, type, breed, latitude, longitude, created, updated) VALUES(?,?,?,?,?,?,?)', params, function (err) {
            var pet_id =  parseInt(this.lastID);
            chai.request(server)
                .get('/api/pet/' + pet_id)
                .end(function(err, res){
                    res.body.should.be.a('array');
                    res.body[0].should.have.property('id');
                    res.body[0].should.have.property('name');
                    res.body[0].should.have.property('type');
                    res.body[0].should.have.property('breed');
                    res.body[0].should.have.property('latitude');
                    res.body[0].should.have.property('longitude');
                    res.body[0].should.have.property('created');
                    res.body[0].should.have.property('updated');
                    res.body[0].name.should.equal('Chime');
                    res.body[0].should.have.property('id').eql(pet_id);
                    done();
                });
        });
    });
});


