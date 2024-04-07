const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Room = require('../models/Room');

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

describe("Room Creation Endpoint", () => {
    it('should return status 201 and a message if room creation is successful', async () => {
        const roomData = {
            name: "101",
            capacity: 10
        };

        const response = await request(app)
          .post('/rooms')
          .send(roomData);
          
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('message', 'Room created successfully');
    });
});

describe("Room API", () => {
    beforeEach(async () => {
        await Room.deleteMany(); // Clear the Room collection before each test
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    it('should return status 400 if room name already exists', async () => {
        // Create a room
        const roomData = {
            name: "101",
            capacity: 10
        };
        await Room.create(roomData);

        // Attempt to create a room with the same name
        const response = await request(app)
            .post('/rooms')
            .send(roomData);

        // Assertions
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', 'This room already exists in the system');
    });

    it('should get all rooms', async () => {
        // Create some rooms
        await Room.create({ name: "Room1", capacity: 10 });
        await Room.create({ name: "Room2", capacity: 15 });
    
        // Get all rooms
        const response = await request(app)
            .get('/rooms');
    
        // Assertions
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(2);
    });
    it('should update room availability', async () => {
        // Create a room
        const roomData = {
            name: "101",
            capacity: 10
        };
        const createdRoom = await Room.create(roomData);
    
        // Update the room's availability
        const updatedAvailability = { isAvailable: false }; // Assuming updating to unavailable
        const response = await request(app)
            .put(`/rooms/${createdRoom._id}`)
            .send(updatedAvailability);
    
        // Assertions
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Room availability updated successfully');
        expect(response.body.room).toMatchObject(updatedAvailability);
    });

    it('should return status 404 if room to update is not found', async () => {
        // Attempt to update a non-existing room
        const response = await request(app)
            .put('/rooms/nonexistentRoomId')
            .send({ isAvailable: false }); // Assuming updating availability
    
        // Assertions
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('error', 'Room not found');
    });

    it('should delete a room by ID', async () => {
        // Create a room
        const roomData = {
            name: "101",
            capacity: 10
        };
        const createdRoom = await Room.create(roomData);
    
        // Delete the room by ID
        const response = await request(app)
            .delete(`/rooms/${createdRoom._id}`);
    
        // Assertions
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Room deleted successfully');
        expect(response.body.room).toMatchObject(roomData);
    });    
});
