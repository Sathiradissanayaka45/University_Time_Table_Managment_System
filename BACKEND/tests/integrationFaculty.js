const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Faculty = require('../models/Faculty');
const User = require('../models/User');
const Course = require('../models/Course');

beforeAll(async () => {
    jest.setTimeout(60000); // Increase the timeout to 60 seconds
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:8000/testDB', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    // Disconnect from MongoDB
    await mongoose.disconnect();
});

describe("Faculty Controller", () => {
    // Increase the timeout for the entire test suite
    jest.setTimeout(60000); // Increase the timeout to 60 seconds
    
    beforeAll(async () => {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:8000/testDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        // Disconnect from MongoDB
        await mongoose.disconnect();
    });

    it('should assign faculty to a course', async () => {
        // Create a user with role Faculty
        const facultyMember = await User.create({ email: 'faculty@example.com', role: 'Faculty' });
        // Create a course
        const course = await Course.create({ name: 'Course 101', code: 'COURSE101' });

        const response = await request(app)
            .post('/faculty/assign-course')
            .send({ facultyId: facultyMember._id, courseId: course._id });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Faculty member assigned to course successfully');
        expect(response.body).toHaveProperty('facultyAssignment');
        // Check if the faculty assignment was saved in the database
        const facultyAssignment = await Faculty.findOne({ userId: facultyMember._id, courseId: course._id });
        expect(facultyAssignment).toBeTruthy();
    });

    it('should return 400 if faculty ID is invalid', async () => {
        const course = await Course.create({ name: 'Course 101', code: 'COURSE101' });

        const response = await request(app)
            .post('/faculty/assign-course')
            .send({ facultyId: 'invalidId', courseId: course._id });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', 'Invalid faculty ID');
    });

    it('should return 400 if course ID is invalid', async () => {
        const facultyMember = await User.create({ email: 'faculty@example.com', role: 'Faculty' });

        const response = await request(app)
            .post('/faculty/assign-course')
            .send({ facultyId: facultyMember._id, courseId: 'invalidId' });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', 'Invalid course ID');
    });

    it('should return 404 if faculty member is not found or does not have the role of faculty', async () => {
        const course = await Course.create({ name: 'Course 101', code: 'COURSE101' });

        const response = await request(app)
            .post('/faculty/assign-course')
            .send({ facultyId: mongoose.Types.ObjectId(), courseId: course._id });

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('error', 'Faculty member is not found or does not have the role of faculty');
    });

    it('should return 404 if course is not found', async () => {
        const facultyMember = await User.create({ email: 'faculty@example.com', role: 'Faculty' });

        const response = await request(app)
            .post('/faculty/assign-course')
            .send({ facultyId: facultyMember._id, courseId: mongoose.Types.ObjectId() });

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('error', 'Course not found');
    });

    it('should return 400 if faculty is already assigned to the course', async () => {
        const facultyMember = await User.create({ email: 'faculty@example.com', role: 'Faculty' });
        const course = await Course.create({ name: 'Course 101', code: 'COURSE101' });
        // Assign the faculty to the course
        await Faculty.create({ userId: facultyMember._id, courseId: course._id });

        const response = await request(app)
            .post('/faculty/assign-course')
            .send({ facultyId: facultyMember._id, courseId: course._id });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', 'Faculty member is already assigned to this course');
    });

    it('should get all faculty members', async () => {
        // Create faculty members
        await User.create({ email: 'faculty1@example.com', role: 'Faculty' });
        await User.create({ email: 'faculty2@example.com', role: 'Faculty' });

        const response = await request(app)
            .get('/faculty');

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('faculty');
        expect(response.body.faculty.length).toBe(2);
    });
});
