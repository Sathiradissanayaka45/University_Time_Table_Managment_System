const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Resource = require('../models/Resource');

const BookingController = {
    book: async (req, res) => {
        try {
          const { roomId, resourceId, startTime, endTime, discription } = req.body;
    
          // Check if the room ID exists
          if (roomId) {
            const roomExists = await Room.exists({ _id: roomId });
            if (!roomExists) {
              return res.status(400).json({ error: 'Room ID does not exist' });
            }
          }
    
          // Check if resource ID is provided and exists
          if (resourceId) {
            const resourceExists = await Resource.exists({ _id: resourceId });
            if (!resourceExists) {
              return res.status(400).json({ error: 'Resource ID does not exist' });
            }
          }
                // Check if startTime is before endTime
          if (startTime >= endTime) {
            return res.status(400).json({ error: 'Start time must be before end time' });
          }
          // Check for overlapping room bookings
          if (roomId) {
            const roomBookingConflict = await Booking.findOne({
              room: roomId,
              startTime: { $lt: endTime },
              endTime: { $gt: startTime }
            });
            if (roomBookingConflict) {
              return res.status(400).json({ error: 'Booking conflicts with existing room booking' });
            }
          }
    
          // Check for overlapping resource bookings
          if (resourceId) {
            const resourceBookingConflict = await Booking.findOne({
              resource: resourceId,
              startTime: { $lt: endTime },
              endTime: { $gt: startTime }
            });
            if (resourceBookingConflict) {
              return res.status(400).json({ error: 'Booking conflicts with existing resource booking' });
            }
          }
    
          // Create the booking
          const booking = new Booking({ room: roomId, resource: resourceId, startTime, endTime, discription });
          await booking.save();
    
          res.status(201).json({ message: 'Booking created successfully', booking });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      },

  getAllBookings: async (req, res) => {
    try {
      const bookings = await Booking.find();
      res.status(200).json({ bookings });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getBookingById: async (req, res) => {
    try {
      const bookingId = req.params.id;
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      res.status(200).json({ booking });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  updateBookingById: async (req, res) => {
    try {
      const bookingId = req.params.id;
      const { roomId, resourceId, startTime, endTime, discription } = req.body;

      // Check if the booking exists
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      // Check if the room ID exists
      if (roomId) {
        const roomExists = await Room.exists({ _id: roomId });
        if (!roomExists) {
          return res.status(400).json({ error: 'Room ID does not exist' });
        }
      }

      // Check if the resource ID exists
      if (resourceId) {
        const resourceExists = await Resource.exists({ _id: resourceId });
        if (!resourceExists) {
          return res.status(400).json({ error: 'Resource ID does not exist' });
        }
      }

      // Check if startTime is before endTime
      if (startTime >= endTime) {
        return res.status(400).json({ error: 'Start time must be before end time' });
      }

      // Check for overlapping bookings except the current one
      const existingBooking = await Booking.findOne({
        $and: [
          { _id: { $ne: bookingId } },
          {
            $or: [
              { room: roomId, startTime: { $lt: endTime }, endTime: { $gt: startTime } },
              { resource: resourceId, startTime: { $lt: endTime }, endTime: { $gt: startTime } }
            ]
          }
        ]
      });
      if (existingBooking) {
        return res.status(400).json({ error: 'Booking conflicts with existing booking' });
      }

      // Update the booking
      booking.room = roomId;
      booking.resource = resourceId;
      booking.startTime = startTime;
      booking.endTime = endTime;
      booking.discription = discription;

      await booking.save();

      res.status(200).json({ message: 'Booking updated successfully', booking });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  deleteBookingById: async (req, res) => {
    try {
      const bookingId = req.params.id;
      const deletedBooking = await Booking.findByIdAndDelete(bookingId);
      if (!deletedBooking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      res.status(200).json({ message: 'Booking deleted successfully', booking: deletedBooking });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

module.exports = BookingController;
