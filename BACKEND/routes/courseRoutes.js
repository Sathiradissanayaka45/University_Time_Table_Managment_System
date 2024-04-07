const express = require('express');
const CourseController = require('../controllers/CourseController');
const loggerMiddleware = require('../middlewares/logger');
const { isFacultyOrAdmin } = require('../middlewares/Authorization/authForFacultyAndAdminMiddleware');

const router = express.Router();

router.use(loggerMiddleware);

// CRUD operations for courses
// Create a new course
router.post('/', isFacultyOrAdmin, CourseController.createCourse);
router.get('/', CourseController.getAllCourses);
router.get('/:id', CourseController.getCourseById);
router.put('/:id', isFacultyOrAdmin, CourseController.updateCourseById);
router.delete('/:id', isFacultyOrAdmin, CourseController.deleteCourseById);

module.exports = router;
