const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Resource = require('../models/Resource');

let mongoServer;

beforeAll(async () => {
    jest.setTimeout(60000); // Increase the timeout to 60 seconds
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    // Clear the Resource collection before each test
    await Resource.deleteMany();
});

describe("Resource Controller", () => {
    describe("createResource", () => {
        it('should create a new resource', async () => {
            const resourceData = {
                name: 'Room 101',
                description: 'Small meeting room'
            };

            const response = await request(app)
                .post('/resources')
                .send(resourceData);

            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('message', 'Resource created successfully');
            expect(response.body).toHaveProperty('resource');
        });

        it('should return status 400 if resource with same name already exists', async () => {
            const existingResource = new Resource({
                name: 'Room 101',
                description: 'Small meeting room'
            });
            await existingResource.save();

            const resourceData = {
                name: 'Room 101',
                description: 'Another meeting room'
            };

            const response = await request(app)
                .post('/resources')
                .send(resourceData);

            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('error', 'This Resource is already exist in the system');
        });
    });

    describe("getAllResources", () => {
        it('should return all resources', async () => {
            const resource1 = new Resource({
                name: 'Room 101',
                description: 'Small meeting room'
            });
            const resource2 = new Resource({
                name: 'Room 102',
                description: 'Large conference room'
            });
            await Resource.insertMany([resource1, resource2]);

            const response = await request(app)
                .get('/resources');

            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(2);
        });
    });

    describe("updateResourceAvailability", () => {
        it('should update resource availability', async () => {
            const resource = new Resource({
                name: 'Room 101',
                description: 'Small meeting room',
                isAvailable: true
            });
            await resource.save();

            const response = await request(app)
                .put(`/resources/${resource._id}`)
                .send({ isAvailable: false });

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('message', 'Resource availability updated successfully');
            expect(response.body.resource.isAvailable).toBe(false);
        });

        it('should return status 404 if resource not found', async () => {
            const response = await request(app)
                .put('/resources/invalidId')
                .send({ isAvailable: false });

            expect(response.statusCode).toBe(404);
            expect(response.body).toHaveProperty('error', 'Resource not found');
        });
    });

    describe("deleteResourceById", () => {
        it('should delete resource by ID', async () => {
            const resource = new Resource({
                name: 'Room 101',
                description: 'Small meeting room'
            });
            await resource.save();

            const response = await request(app)
                .delete(`/resources/${resource._id}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('message', 'Resource deleted successfully');
            expect(response.body.resource._id).toBe(resource._id.toString());
        });

        it('should return status 404 if resource not found', async () => {
            const response = await request(app)
                .delete('/resources/invalidId');

            expect(response.statusCode).toBe(404);
            expect(response.body).toHaveProperty('error', 'Resource not found');
        });
    });
});
