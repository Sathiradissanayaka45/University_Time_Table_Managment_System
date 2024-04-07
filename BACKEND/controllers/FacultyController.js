const Faculty = require('../models/Faculty');
const User = require('../models/User');
const Course = require('../models/Course');
const mongoose = require('mongoose');

const facultyController = {
  assignFacultyToCourse: async (req, res) => {
    try {
      const { facultyId, courseId } = req.body;
  
      // Check if the facultyId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(facultyId)) {
        return res.status(400).json({ error: 'Invalid faculty ID' });
      }
  
      // Check if the courseId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({ error: 'Invalid course ID' });
      }
  
      let facultyMember, course;
  
      // Query the faculty member by ID or email
      if (mongoose.Types.ObjectId.isValid(facultyId)) {
        facultyMember = await User.findById(facultyId);
      } else {
        facultyMember = await User.findOne({ email: facultyId });
      }
  
      // Check if user exists and has the role of faculty
      if (!facultyMember || facultyMember.role !== 'Faculty') {
        return res.status(404).json({ error: 'Faculty member is not found or does not have the role of faculty' });
      }
  
      // Query the course by ID or code
      if (mongoose.Types.ObjectId.isValid(courseId)) {
        course = await Course.findById(courseId);
      } else {
        course = await Course.findOne({ code: courseId });
      }
  
      // Check if the course exists
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
  
      // Check if faculty is already assigned to the course
      const existingAssignment = await Faculty.findOne({ userId: facultyMember._id, courseId: course._id });
      if (existingAssignment) {
        return res.status(400).json({ error: 'Faculty member is already assigned to this course' });
      }
  
      // Create a new faculty assignment
      const newFacultyAssignment = new Faculty({
        userId: facultyMember._id,
        courseId: course._id
      });
  
      // Save the new faculty assignment
      await newFacultyAssignment.save();
  
      res.status(200).json({ 
        message: 'Faculty member assigned to course successfully', 
        facultyAssignment: newFacultyAssignment 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  getAllFaculty: async (req, res) => {
    try {
      const allFaculty = await Faculty.find();
      res.status(200).json({ faculty: allFaculty });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

module.exports = facultyController;
