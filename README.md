PET Shelter API
===============

This application is a behind the scenes service that manages a datastore of Pets. 

### Pet Shelter API has three endpoits

1. An index of Pets
2. Receive request to add new pet into database
3. Return all information of individual pet

| Route         | HTTP Verb     | Description  |
| ------------- |:-------------:| -----:|
| /api/pets     | GET           | An index of Pets |
| /api/pets     | POST          | add new pet into database |
| /api/pet/:petId | GET      |    Get a single pet |

#### BASE URL

=> localhost `http://localhost:8080`
=> Heroku: https://api-pet-shelter.herokuapp.com


#### Dependency
1. need js version 8 or higher
2. Git
3. sqlite3


#### Setup @localhost

1. run `git clone git@github.com:streetcoder/pet-shelter-api.git`
2. run `cd pet-shelter-api`
3. run `npm install`
4. `npm start`

#### Testing Instruction
- Make the database empty
- run `sqlite3 pet_shelter_api_test.db`
- run `delete from pets;`
- closing sqlite3 console: run `.quit`
- npm test


