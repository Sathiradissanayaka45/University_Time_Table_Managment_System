const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Course = require('../models/Course');

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

describe("Course Creation Endpoint", () => {
    it('should return status 201 and a message if course creation is successful', async () => {
        const courseData = {
            name: "Mathematics",
            code: "MATH101",
            description: "Introduction to Mathematics",
            credits: 3
        };

        const response = await request(app)
            .post('/courses')
            .send(courseData);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('message', 'Course created successfully');
    });
});

describe("Course API", () => {
    beforeEach(async () => {
        await Course.deleteMany(); // Clear the Course collection before each test
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    it('should return status 400 if course code already exists', async () => {
        // Create a course
        const courseData = {
            name: "Physics",
            code: "PHYS101",
            description: "Introduction to Physics",
            credits: 4
        };
        await Course.create(courseData);

        // Attempt to create a course with the same code
        const response = await request(app)
            .post('/courses')
            .send(courseData);

        // Assertions
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', 'A course with this code already exists');
    });

    it('should get all courses', async () => {
        // Create some courses
        await Course.create({ name: "Course1", code: "COURSE101", description: "Description1", credits: 3 });
        await Course.create({ name: "Course2", code: "COURSE102", description: "Description2", credits: 4 });
    
        // Get all courses
        const response = await request(app)
            .get('/courses');
    
        // Assertions
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined(); // Ensure response body is defined
        expect(Array.isArray(response.body.courses)).toBe(true); // Ensure courses property is an array
        expect(response.body.courses.length).toBe(2);
    });
    
    it('should update course information', async () => {
        // Create a course
        const courseData = {
            name: "Physics",
            code: "PHYS101",
            description: "Introduction to Physics",
            credits: 4
        };
        const createdCourse = await Course.create(courseData);

        // Update the course's description
        const updatedDescription = { description: "Advanced Physics" };
        const response = await request(app)
            .put(`/courses/${createdCourse._id}`)
            .send(updatedDescription);

        // Assertions
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Course updated successfully');
        expect(response.body.course).toMatchObject(updatedDescription);
    });

    it('should return status 404 if course to update is not found', async () => {
        // Attempt to update a non-existing course
        const response = await request(app)
            .put('/courses/nonexistentCourseId')
            .send({ description: "Updated Description" });

        // Assertions
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('error', 'Course not found');
    });

    it('should delete a course by ID', async () => {
        // Create a course
        const courseData = {
            name: "Physics",
            code: "PHYS101",
            description: "Introduction to Physics",
            credits: 4
        };
        const createdCourse = await Course.create(courseData);

        // Delete the course by ID
        const response = await request(app)
            .delete(`/courses/${createdCourse._id}`);

        // Assertions
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Course deleted successfully');
        expect(response.body.course).toMatchObject(courseData);
    });
});
