const express = require('express');
const ClassSessionController = require('../controllers/ClassSessionController');
const { isFacultyOrAdmin} = require('../middlewares/Authorization/authForFacultyAndAdminMiddleware');

const router = express.Router();

// Create a class session
router.post('/', isFacultyOrAdmin, ClassSessionController.createClassSession);

// Update a class session
router.put('/:classSessionId',isFacultyOrAdmin, ClassSessionController.updateClassSession);

// Get all class sessions
router.get('/', isFacultyOrAdmin, ClassSessionController.getAllClassSessions);

// Delete a class session
router.delete('/:classSessionId', isFacultyOrAdmin, isFacultyOrAdmin, ClassSessionController.deleteClassSession);

module.exports = router;
