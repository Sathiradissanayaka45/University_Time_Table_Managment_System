const express = require('express');
const NotificationController = require('../controllers/notificationController');
const { isFacultyOrAdmin } = require('../middlewares/Authorization/authForFacultyAndAdminMiddleware');

const router = express.Router();

// Send announcement to all users
router.post('/announcement', isFacultyOrAdmin, NotificationController.sendAnnouncement);

// Send timetable update notification to all users
//router.post('/timetable-update', NotificationController.sendTimetableUpdate);

router.post('/timetable-update-notification', isFacultyOrAdmin, NotificationController.sendTimetableUpdateNotification);

// Get all announcements
router.get('/announcements', NotificationController.getAllAnnouncements);

module.exports = router;