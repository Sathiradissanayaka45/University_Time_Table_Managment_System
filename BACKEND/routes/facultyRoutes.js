const express = require('express');
const FacultyController = require('../controllers/FacultyController');
const { isAdmin} = require('../middlewares/Authorization/authForAdminMiddleware');

const router = express.Router();

// Assign a faculty to a course (only accessible by admin)
router.post('/assign-course', isAdmin, FacultyController.assignFacultyToCourse);

// Get all faculty members
router.get('/', FacultyController.getAllFaculty);


module.exports = router;
