const express = require('express');
const EnrollmentController = require('../controllers/enrollmentController');
const { isFacultyOrAdmin } = require('../middlewares/Authorization/authForFacultyAndAdminMiddleware');


const router = express.Router();

router.post('/enroll', EnrollmentController.enroll);
router.get('/:studentId', EnrollmentController.getEnrollmentsByStudentId);
router.get('/course/:courseId',isFacultyOrAdmin, EnrollmentController.getEnrollmentsByCourseId);
router.delete('/:enrollmentId',isFacultyOrAdmin, EnrollmentController.deleteEnrollment);

module.exports = router;
