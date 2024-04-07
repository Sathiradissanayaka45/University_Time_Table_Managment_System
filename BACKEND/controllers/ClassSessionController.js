const ClassSession = require('../models/ClassSession');
const Course = require('../models/Course')
const Faculty = require('../models/Faculty');
const User = require('../models/User');
const Room = require('../models/Room');
const transporter = require('../config/transporter');
// const Resource = require('../models/Resource');
//const mongoose = require('mongoose');

const ClassSessionController = {
  createClassSession: async (req, res) => {
    try {
      const { course, module, day, time, faculty, location} = req.body;

      //resourceId
  
      // Check if the provided course ID exists in the database
      const validCourse = await Course.findById(course);
      if (!validCourse) {
        return res.status(400).json({ error: 'The provided course ID does not exist in the database. Please provide a valid course ID.' });
      }
      
      // Check if the faculty member is assigned to the specified course
      const isAssignedToCourse = await Faculty.exists({ userId: faculty, courseId: course });
      if (!isAssignedToCourse) {
        return res.status(400).json({ error: 'The provided faculty member is not assigned to this course. Please assign the faculty member to this course before creating a class session or select another faculty member.' });
      }
  
      // Check if the provided location ID exists in the database
      const validLocation = await Room.findById(location);
      if (!validLocation) {
        return res.status(400).json({ error: 'The provided location ID does not exist in the database. Please provide a valid location ID.' });
      }
  
      // Check if the provided resource ID exists in the database
      // const validResource = await Resource.findById(resourceId);
      // if (!validResource) {
      //   return res.status(400).json({ error: 'The provided resource ID does not exist in the database. Please provide a valid resource ID.' });
      // }
  
      // Check if a class session with the same day, location, and resource already exists
      const existingSession = await ClassSession.findOne({
        day,
        location,
       // resourceId,
        $or: [
          {
            $and: [
              { 'time.start': { $lte: time.end } },
              { 'time.end': { $gte: time.start } }
            ]
          },
          {
            $and: [
              { 'time.start': { $lte: time.start } },
              { 'time.end': { $gte: time.end } }
            ]
          }
        ]
      });
  
    // If session exists, check if the course ID is the same
    if (existingSession) {
      if (existingSession.course.toString() === course) {
        return res.status(400).json({ error: 'A class session for the same day, location already exists during this time slot for this course.' });
      }
      return res.status(400).json({ error: 'A class session for the same day, location already exists during this time slot for a different course.' });
    }
  
      // Create a new class session
      const newClassSession = new ClassSession({ course, module, day, time, faculty, location});
      // , resourceId
      await newClassSession.save();
  
      res.status(201).json({ message: 'Class session created successfully', classSession: newClassSession });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  
  
  updateClassSession: async (req, res) => {
    try {
      const { classSessionId } = req.params;
      const { day, time, faculty, location, course} = req.body;
  
      // Check if the provided course ID exists in the database
      const validCourse = await Course.findById(course);
      if (!validCourse) {
        return res.status(400).json({ error: 'The provided course ID does not exist in the database. Please provide a valid course ID.' });
      }
  
      // Check if the provided faculty ID exists in the database
      const existingFaculty = await Faculty.findOne({ userId: faculty });
      if (!existingFaculty) {
        return res.status(400).json({ error: 'The provided faculty member does not exist. Please provide a valid faculty ID.' });
      }
  
      // Check if the faculty member is assigned to the specified course
      const isAssignedToCourse = await Faculty.exists({ userId: faculty, courseId: course });
      if (!isAssignedToCourse) {
        return res.status(400).json({ error: 'The provided faculty member is not assigned to the specified course. Please assign the faculty member to the course before updating the class session.' });
      }
  
      // Check if the provided location ID exists in the database
      const validLocation = await Room.findById(location);
      if (!validLocation) {
        return res.status(400).json({ error: 'The provided location ID does not exist in the database. Please provide a valid location ID.' });
      }
  
      // Check if the provided resource ID exists in the database
      // const validResource = await Resource.findById(resourceId);
      // if (!validResource) {
      //   return res.status(400).json({ error: 'The provided resource ID does not exist in the database. Please provide a valid resource ID.' });
      // }
  
      // Check if there's an existing session for the same day, time, location, and resource
      const existingSession = await ClassSession.findOne({
        _id: { $ne: classSessionId }, // Exclude the current session being updated
        day,
        location,
        //resourceId,
        $or: [
          {
            $and: [
              { 'time.start': { $lte: time.end } },
              { 'time.end': { $gte: time.start } }
            ]
          },
          {
            $and: [
              { 'time.start': { $lte: time.start } },
              { 'time.end': { $gte: time.end } }
            ]
          }
        ]
      });
  
      if (existingSession) {
        return res.status(400).json({ error: 'A class session with the same day, time, location, and Faculty already exists. Please choose a different time slot, location, or Faculty.' });
      }
  
      // Update the class session
      const updatedClassSession = await ClassSession.findByIdAndUpdate(
        classSessionId,
        { day, time, faculty, location, course},
        { new: true }
      );
  
      if (!updatedClassSession) {
        return res.status(404).json({ error: 'Class session not found' });
      }
            // Send notification email to students
            const students = await User.find({ role: 'Student' });
            const mailOptions = {
              from: 'sliittimetable20@gmail.com',
              subject: 'Class Session Update',
              text: `The class session for ${updatedClassSession.day} has been updated. Please check your updated timetable.`,
            };
      
            students.forEach(async (student) => {
              mailOptions.to = student.email;
              await transporter.sendMail(mailOptions);
            });
  
      res.status(200).json({ message: 'Class session updated successfully', classSession: updatedClassSession });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getAllClassSessions: async (req, res) => {
    try {
      const allClassSessions = await ClassSession.find();
      res.status(200).json({ classSessions: allClassSessions });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  

  // Delete a class session
  deleteClassSession: async (req, res) => {
    try {
      const { classSessionId } = req.params;

      const deletedClassSession = await ClassSession.findOneAndDelete({ _id: classSessionId });

      if (!deletedClassSession) {
        return res.status(404).json({ error: 'Class session not found' });
      }

      res.status(200).json({ message: 'Class session deleted successfully', classSession: deletedClassSession });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

module.exports = ClassSessionController;
