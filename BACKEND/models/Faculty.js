const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Each faculty can be assigned to only one course
    unique: true // Ensure that each faculty is assigned to only one course
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  }
});

// Add index on userId field to ensure uniqueness
facultySchema.index({ userId: 1 }, { unique: true });

const Faculty = mongoose.model('Faculty', facultySchema);

module.exports = Faculty;
