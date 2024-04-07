const Room = require('../models/Room');
const mongoose = require('mongoose');

const RoomController = {
  createRoom: async (req, res) => {
    try {
      const { name, capacity } = req.body;
  
      // Check if a room with the provided name already exists
      const existingRoom = await Room.findOne({ name });
      if (existingRoom) {
        return res.status(400).json({ error: 'This room already exists in the system' });
      }
  
      // If the room doesn't exist, create a new room
      const newRoom = new Room({ name, capacity });
      await newRoom.save();
  
      res.status(201).json({ message: 'Room created successfully', room: newRoom });
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
  
      // Check for specific error types
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
  
      // Handle database-related errors
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  getAllRooms: async (req, res) => {
    try {
      const rooms = await Room.find();
      res.json(rooms);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  updateRoomAvailability: async (req, res) => {
    try {
      const { roomId } = req.params;
      const { isAvailable } = req.body;

      let updatedRoom;

      // Check if roomId is a valid MongoDB ObjectId
      if (mongoose.isValidObjectId(roomId)) {
        updatedRoom = await Room.findByIdAndUpdate(roomId, { isAvailable }, { new: true });
      } else {
        // Assume roomId is the room's name and update based on that
        updatedRoom = await Room.findOneAndUpdate({ name: roomId }, { isAvailable }, { new: true });
      }

      if (!updatedRoom) {
        return res.status(404).json({ error: 'Room not found' });
      }

      res.status(200).json({ message: 'Room availability updated successfully', room: updatedRoom });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  deleteRoomById: async (req, res) => {
    try {
      const { roomId } = req.params;

      // Check if roomId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(roomId)) {
        return res.status(400).json({ error: 'Invalid room ID' });
      }

      // Find the room by ID and delete it
      const deletedRoom = await Room.findByIdAndDelete(roomId);

      if (!deletedRoom) {
        return res.status(404).json({ error: 'Room not found' });
      }

      res.status(200).json({ message: 'Room deleted successfully', room: deletedRoom });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = RoomController;