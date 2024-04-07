const ClassSession = require('../models/ClassSession');
const Enrollment = require('../models/Enrollment');

const TimetableController = {

  getTimetableByStudentId: async (req, res) => {
    try {
      const studentId = req.params.studentId;

      // Fetch enrolled courses for the student
      const enrollments = await Enrollment.find({ student: studentId }).populate('course');
      const courseIds = enrollments.map(enrollment => enrollment.course._id);

      // Fetch class sessions for the enrolled courses
      const timetable = await ClassSession.find({ course: { $in: courseIds } });

      res.status(200).json({ timetable });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = TimetableController;
