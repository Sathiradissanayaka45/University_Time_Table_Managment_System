const Course = require('../models/Course');
const mongoose = require('mongoose');

const CourseController = {
  createCourse: async (req, res) => {
    try {
      const { name, code, description, credits } = req.body;

      // Check if a course with the provided code already exists
      const existingCourse = await Course.findOne({ code });

      if (existingCourse) {
        return res.status(400).json({ error: 'A course with this code already exists' });
      }

      const newCourse = new Course({ name, code, description, credits });
      await newCourse.save();

      res.status(201).json({ message: 'Course created successfully', course: newCourse });
    } catch (error) {
      console.error(error);

      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Get all courses
  getAllCourses: async (req, res) => {
    try {
      const courses = await Course.find();
      res.status(200).json({ courses });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getCourseById: async (req, res) => {
    try {
      let course;

      const courseId = req.params.id;

      // Check if the provided courseId is a valid MongoDB ObjectId
      if (mongoose.isValidObjectId(courseId)) {
        // If it's a valid ObjectId, query the course by _id
        course = await Course.findById(courseId);
      } else {
        // If it's not a valid ObjectId, assume it's a course code and query by code
        course = await Course.findOne({ code: courseId });
      }

      // Check if the course is found
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      // Return the course data
      res.status(200).json({ course });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Update a course by ID
  updateCourseById: async (req, res) => {
    try {
      const courseIdOrCode = req.params.id; // This can be either the _id or the code
      const { name, description, credits } = req.body;

          // Check if the code field is provided in the request body
      // if (code) {
      //   return res.status(400).json({ error: 'You cannot update the course code' });
      // }
  
      let updatedCourse;
  
      // Check if courseIdOrCode is a valid ObjectId
      if (mongoose.Types.ObjectId.isValid(courseIdOrCode)) {
        // If it's a valid ObjectId, update by _id
        updatedCourse = await Course.findByIdAndUpdate(
          courseIdOrCode,
          { name, description, credits },
          { new: true }
        );
      } else {
        // If it's not a valid ObjectId, assume it's a course code and update by code
        updatedCourse = await Course.findOneAndUpdate(
          { code: courseIdOrCode },
          { name, description, credits },
          { new: true }
        );
      }
  
      if (!updatedCourse) {
        return res.status(404).json({ error: 'Course not found' });
      }
  
      res.status(200).json({ message: 'Course updated successfully', course: updatedCourse });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  deleteCourseById: async (req, res) => {
    try {
      const courseIdOrCode = req.params.id; // This can be either the _id or the code
  
      let deletedCourse;
  
      // Check if courseIdOrCode is a valid ObjectId
      if (mongoose.Types.ObjectId.isValid(courseIdOrCode)) {
        // If it's a valid ObjectId, delete by _id
        deletedCourse = await Course.findByIdAndDelete(courseIdOrCode);
      } else {
        // If it's not a valid ObjectId, assume it's a course code and delete by code
        deletedCourse = await Course.findOneAndDelete({ code: courseIdOrCode });
      }
  
      if (!deletedCourse) {
        return res.status(404).json({ error: 'Course not found' });
      }
  
      res.status(200).json({ message: 'Course deleted successfully', course: deletedCourse });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = CourseController;
