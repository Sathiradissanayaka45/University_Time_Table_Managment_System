const express = require('express');
const BookingController = require('../controllers/BookingController');
const { isFacultyOrAdmin } = require('../middlewares/Authorization/authForFacultyAndAdminMiddleware');
const { isAdmin } = require('../middlewares/Authorization/authForAdminMiddleware');

const router = express.Router();

// Create a booking
router.post('/',isFacultyOrAdmin, BookingController.book);

// Get all bookings
router.get('/',isAdmin, BookingController.getAllBookings);

// Get booking by ID
router.get('/:id',isAdmin, BookingController.getBookingById);

// Update booking by ID
router.put('/:id',isFacultyOrAdmin, BookingController.updateBookingById);

// Delete booking by ID
router.delete('/:id',isFacultyOrAdmin, BookingController.deleteBookingById);

module.exports = router;
