const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/User');

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
    // Clear the User collection before each test
    await User.deleteMany();
});

describe("User Registration Endpoint", () => {
    beforeEach(async () => {
        await User.deleteMany(); // Clear the User collection before each test
    });

    it('should register a new user', async () => {
        const userData = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password',
            role: 'Student'
        };

        const response = await request(app)
            .post('/auth/register')
            .send(userData);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('message', 'Student registration successful');
    });

    it('should return status 400 if email already exists', async () => {
        const existingUser = new User({
            username: 'existinguser',
            email: 'existing@example.com',
            password: 'password',
            role: 'Student'
        });
        await existingUser.save();

        const userData = {
            username: 'newuser',
            email: 'existing@example.com', // Using existing email
            password: 'password',
            role: 'Student'
        };

        const response = await request(app)
            .post('/auth/register')
            .send(userData);

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', 'Email already exists');
    });

    // Add more test cases for different scenarios
});


