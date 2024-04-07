const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const loggerMiddleware = require('./middlewares/logger');
const facultyRoutes = require('./routes/facultyRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const classSessionRoutes = require('./routes/classSessionRoutes');
const roomRoutes = require('./routes/roomRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(loggerMiddleware);

// Register the authentication routes
app.use('/auth', authRoutes);

// Register course routes
app.use('/courses', courseRoutes);

// Register faculty routes
app.use('/faculty', facultyRoutes);

// Register timetable routes
app.use('/timetable', timetableRoutes);

// Register class session routes
app.use('/class-sessions', classSessionRoutes);

// Register room routes
app.use('/rooms', roomRoutes);

// Register resource routes
app.use('/resources', resourceRoutes);

// Register enrollment routes
app.use('/enrollments', enrollmentRoutes);

// Use notification routes
app.use('/notifications', notificationRoutes);

// Use Booking routes
app.use('/bookings', bookingRoutes);

module.exports = app;



