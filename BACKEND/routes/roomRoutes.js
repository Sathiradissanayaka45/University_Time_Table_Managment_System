const express = require('express');
const RoomController = require('../controllers/RoomController');
const { isFacultyOrAdmin } = require('../middlewares/Authorization/authForFacultyAndAdminMiddleware');
const { isAdmin } = require('../middlewares/Authorization/authForAdminMiddleware');

const router = express.Router();

// Create a room
router.post('/', isAdmin, RoomController.createRoom);

// Get all rooms
router.get('/', isFacultyOrAdmin, RoomController.getAllRooms);

// Update a room's availability
router.put('/:roomId', isFacultyOrAdmin, RoomController.updateRoomAvailability);

// Delete a room by ID
router.delete('/:roomId', isAdmin, RoomController.deleteRoomById);

module.exports = router;