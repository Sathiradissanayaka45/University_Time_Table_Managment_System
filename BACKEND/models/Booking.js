// Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
 // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Assuming you have a User model
  room: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Room'
},
  resource: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Resource'
},
  startTime: { 
    type: Date, 
    required: true 
},
  endTime: { 
    type: Date, 
    required: true 
},
  discription: {
    type : String,
    require: true
  }
});


const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
