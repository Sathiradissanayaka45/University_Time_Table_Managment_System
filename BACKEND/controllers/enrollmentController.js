const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const Course = require('../models/Course');

const EnrollmentController = {
  enroll: async (req, res) => {
    try {
      const { studentId, courseId } = req.body;

      const userExists = await User.exists({ _id: studentId });
      if (!userExists) {
        return res.status(400).json({ error: 'User ID does not exist' });
      }
    

      const courseExists = await Course.exists({ _id: courseId });
      if (!courseExists) {
        return res.status(400).json({ error: 'Course ID does not exist' });
      }
    
      // Check if the student is already enrolled in the course
      const existingEnrollment = await Enrollment.findOne({ student: studentId, course: courseId });
      if (existingEnrollment) {
        return res.status(400).json({ error: 'Student is already enrolled in this course' });
      }

      const enrollment = new Enrollment({ student: studentId, course: courseId });
      await enrollment.save();

      res.status(201).json({ message: 'Enrollment successful', enrollment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getEnrollmentsByStudentId: async (req, res) => {
    try {
      const studentId = req.params.studentId;

      const enrollments = await Enrollment.find({ student: studentId }).populate('course');
      res.status(200).json({ enrollments });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getEnrollmentsByCourseId: async (req, res) => {
    try {
      const courseId = req.params.courseId;
      const enrollments = await Enrollment.find({ course: courseId }).populate('student');
      res.status(200).json({ enrollments });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  deleteEnrollment: async (req, res) => {
    try {
      const enrollmentId = req.params.enrollmentId;
      await Enrollment.findByIdAndDelete(enrollmentId);
      res.status(200).json({ message: 'Enrollment deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = EnrollmentController;
