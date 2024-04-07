const express = require('express');
const TimetableController = require('../controllers/TimetableController');

const router = express.Router();


router.get('/:studentId', TimetableController.getTimetableByStudentId);

module.exports = router;

