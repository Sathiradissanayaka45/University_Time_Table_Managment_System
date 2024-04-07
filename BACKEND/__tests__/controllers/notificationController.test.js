const NotificationController = require('../../controllers/notificationController');
const User = require('../../models/User');
const transporter = require('../../config/transporter');
const notification = require('../../models/notification');

jest.mock('../../models/User');
jest.mock('../../config/transporter');
jest.mock('../../models/notification');

describe('NotificationController', () => {
  describe('sendAnnouncement', () => {
    it('should send announcement successfully', async () => {
      const req = { body: { message: 'Test announcement' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const mockUserFind = jest.spyOn(User, 'find').mockResolvedValueOnce([{ email: 'student1@example.com' }]);
      const mockTransporterSendMail = jest.spyOn(transporter, 'sendMail').mockResolvedValueOnce();

      await NotificationController.sendAnnouncement(req, res);

      expect(mockUserFind).toHaveBeenCalledWith({ role: 'Student' });
      expect(mockTransporterSendMail).toHaveBeenCalledWith({
        from: 'sathiradissanayaka80@gmail.com',
        subject: 'Announcement',
        text: 'Test announcement',
        bcc: ['student1@example.com'],
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Announcement sent successfully' });
    });

    it('should handle error and return 500 status', async () => {
      const req = { body: { message: 'Test announcement' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(User, 'find').mockRejectedValueOnce('Database error');

      await NotificationController.sendAnnouncement(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('sendTimetableUpdateNotification', () => {
    it('should send timetable update notification successfully', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const mockUserFind = jest.spyOn(User, 'find').mockResolvedValueOnce([{ email: 'student1@example.com' }]);
      const mockTransporterSendMail = jest.spyOn(transporter, 'sendMail').mockResolvedValueOnce();

      await NotificationController.sendTimetableUpdateNotification({}, res);

      expect(mockUserFind).toHaveBeenCalledWith({ role: 'Student' });
      expect(mockTransporterSendMail).toHaveBeenCalledWith({
        from: 'sathiradissanayaka80@gmail.com',
        subject: 'Timetable Update',
        text: 'There is an update to the timetable. Please check the latest timetable.',
        to: 'student1@example.com',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Timetable update notification sent successfully' });
    });

    it('should handle error and return 500 status', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jest.spyOn(User, 'find').mockRejectedValueOnce('Database error');

      await NotificationController.sendTimetableUpdateNotification({}, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });
});
describe('NotificationController', () => {
  describe('getAllAnnouncements', () => {
    it('should return all announcements successfully', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockAnnouncements = [{ message: 'Announcement 1' }, { message: 'Announcement 2' }];
      jest.spyOn(notification, 'find').mockResolvedValueOnce(mockAnnouncements);

      await NotificationController.getAllAnnouncements({}, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ announcements: mockAnnouncements });
    });

    it('should handle error and return 500 status', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      jest.spyOn(notification, 'find').mockRejectedValueOnce('Database error');

      await NotificationController.getAllAnnouncements({}, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });
});
