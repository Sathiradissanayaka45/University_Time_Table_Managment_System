const Notification = require('../models/notification');
const User = require('../models/User');
const transporter = require('../config/transporter');

const NotificationController = {
  sendAnnouncement: async (req, res) => {
    try {
      const { message } = req.body;
      
      const announcement = new Notification({ message, type: 'Announcement' });
      await announcement.save();

      // Get all users
      // const users = await User.find();

      // Send notification to all users
      // users.forEach(async (user) => {
      //   const notification = new Notification({ message, type: 'Announcement', userId: user._id });
      //   await notification.save();
      // });

      const students = await User.find({ role: 'Student' });
            // Extract email addresses of all students
            const studentEmails = students.map(student => student.email);
            // Compose email options
            const mailOptions = {
              from: 'sathiradissanayaka80@gmail.com', // Sender's email address
              subject: 'Announcement',// Email subject
              text: message,
              bcc: studentEmails
            };
      
      // Send the email to all students
      await transporter.sendMail(mailOptions);

      res.status(201).json({ message: 'Announcement sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  sendTimetableUpdateNotification: async (req, res) => {
    try {
      // Get all users with role "Student"
      const students = await User.find({ role: 'Student' });

      // Compose email options
      const mailOptions = {
        from: 'sathiradissanayaka80@gmail.com', // Sender's email address
        subject: 'Timetable Update', // Email subject
        text: 'There is an update to the timetable. Please check the latest timetable.', // Plain text body of the email
      };

      // Send email to each student
      students.forEach(async (student) => {
        mailOptions.to = student.email; // Set recipient's email address
        await transporter.sendMail(mailOptions); // Send email
      });

      res.status(200).json({ message: 'Timetable update notification sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  getAllAnnouncements: async (req, res) => {
    try {
      const announcements = await Notification.find({ type: 'Announcement' });
      res.status(200).json({ announcements });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  
};

module.exports = NotificationController;