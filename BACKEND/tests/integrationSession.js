const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const ClassSession = require('../models/ClassSession');
const User = require('../models/User');
const Course = require('../models/Course');
const Faculty = require('../models/Faculty');
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

beforeEach(async () => {
    // Clear the collections before each test
    await ClassSession.deleteMany();
    await User.deleteMany();
    await Course.deleteMany();
    await Faculty.deleteMany();
    await Room.deleteMany();
});

describe("Class Session Controller", () => {
    // it('should create a new class session', async () => {
    //     // Create necessary data
    //     const course = new mongoose.Types.ObjectId();
    //     const faculty = new mongoose.Types.ObjectId();
    //     const location = new mongoose.Types.ObjectId();

    //     await User.create({ _id: faculty, role: 'Faculty' });
    //     await Room.create({ _id: location });

    //     const sessionData = {
    //         course,
    //         module: 'Test Module',
    //         day: 'Monday',
    //         time: { start: '10:00', end: '12:00' },
    //         faculty,
    //         location
    //     };

    //     const response = await request(app)
    //         .post('/class-sessions')
    //         .send(sessionData);

    //     expect(response.statusCode).toBe(201);
    //     expect(response.body).toHaveProperty('message', 'Class session created successfully');
    // });


    // describe("Update a Class Session", () => {
    //     it('should update an existing class session', async () => {
    //         // Create a class session to update
    //         const createdSession = await ClassSession.create({
    //             course: new mongoose.Types.ObjectId(),
    //             module: 'Test Module',
    //             day: 'Monday',
    //             time: { start: '10:00', end: '12:00' },
    //             faculty: new mongoose.Types.ObjectId(),
    //             location: new mongoose.Types.ObjectId()
    //         });
    
    //         const updatedData = {
    //             day: 'Tuesday', // Update the day
    //         };
    
    //         const response = await request(app)
    //             .put(`/class-sessions/${createdSession._id}`)
    //             .send(updatedData);
    
    //         expect(response.statusCode).toBe(200);
    //         expect(response.body).toHaveProperty('message', 'Class session updated successfully');
    //     });

    //     // Add more test cases to cover scenarios such as updating with invalid data, non-existing class session, etc.
    // });

    describe("Get All Class Sessions", () => {
        it('should retrieve all class sessions', async () => {
            // Create some class sessions
            await ClassSession.create([
                {
                    course: new mongoose.Types.ObjectId(),
                    module: 'Test Module 1',
                    day: 'Monday',
                    time: {
                        start: '10:00 AM',
                        end: '12:00 PM'
                    },
                    faculty: new mongoose.Types.ObjectId(),
                    location: new mongoose.Types.ObjectId()
                },
                {
                    course: new mongoose.Types.ObjectId(),
                    module: 'Test Module 2',
                    day: 'Tuesday',
                    time: {
                        start: '01:00 PM',
                        end: '03:00 PM'
                    },
                    faculty: new mongoose.Types.ObjectId(),
                    location: new mongoose.Types.ObjectId()
                }
            ]);

            const response = await request(app)
                .get('/class-sessions');

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('classSessions');
            expect(response.body.classSessions.length).toBe(2);
        });

        // Add more test cases to cover scenarios such as empty class sessions, etc.
    });
    describe("Delete a Class Session", () => {
        it('should delete an existing class session', async () => {
            // Create a class session to delete
            const createdSession = await ClassSession.create({
                course: new mongoose.Types.ObjectId(),
                module: 'Test Module',
                day: 'Monday',
                time: {
                    start: '10:00 AM',
                    end: '12:00 PM'
                },
                faculty: new mongoose.Types.ObjectId(),
                location: new mongoose.Types.ObjectId()
            });

            const response = await request(app)
                .delete(`/class-sessions/${createdSession._id}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('message', 'Class session deleted successfully');
        });

        // Add more test cases to cover scenarios such as deleting a non-existing class session, etc.
    });
});
