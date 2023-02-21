const request = require('supertest');
// express app
const app = require('./index');

// db setup
const { sequelize, Dog } = require('./db');
const seed = require('./db/seedFn');
const {dogs} = require('./db/seedData');

describe('Endpoints', () => {
    // to be used in POST test
    const testDogData = {
        breed: 'Poodle',
        name: 'Sasha',
        color: 'black',
        description: 'Sasha is a beautiful black pooodle mix.  She is a great companion for her family.'
    };

    beforeAll(async () => {
        // rebuild db before the test suite runs
        await seed();
    });

    describe('GET /dogs', () => {
        it('should return list of dogs with correct data', async () => {
            // make a request
            const response = await request(app).get('/dogs');
            // assert a response code
            expect(response.status).toBe(200);
            // expect a response
            expect(response.body).toBeDefined();
            // toEqual checks deep equality in objects
            expect(response.body[0]).toEqual(expect.objectContaining(dogs[0]));
        });
    });

    describe('GET /dogs/:id', () => {
        it('should return a dog of a specified id', async () => {
            const id = 3;
            // make a request
            const response = await request(app).get(`/dogs/${id}`);

            const [dog] = await Dog.findAll({ where: { id } });
            console.log(dog[0])
            // assert a response code
            expect(response.status).toBe(200);
            // expect a response
            expect(response.body).toBeDefined();
            expect(response.body.breed).toEqual((dog.breed));
            expect(response.body.breed).toEqual((testDogData.breed));
        });
    });

    describe('POST /dogs', () => {
        it('should return new creation of dog with correct data', async () => {
            // make a request
            const response = await request(app).post('/dogs').send(testDogData);
            // assert a response code
            expect(response.status).toBe(200);
            // expect a response
            expect(response.body).toBeDefined();
            // toEqual checks deep equality in objects
            expect(response.body.name).toEqual(testDogData.name);
            expect(response.body.color).toEqual(testDogData.color);
            expect(response.body["description"]).toEqual(testDogData.description);
        });
    });

    describe('DELETE /dogs/:id', () => {
        it('should delete an existing dog', async () => {
            const id = 1;
            // make a request
            const response = await request(app).delete(`/dogs/${id}`)

            const [deltedDog] = await Dog.findAll({ where: { id } });

            expect(response.status).toBe(200);
            expect(response.text).toEqual(`deleted dog with id ${id}`);
            expect(deltedDog).toBeUndefined();
        });
    });
});