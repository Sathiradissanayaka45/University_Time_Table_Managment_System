const EnrollmentController = require('../../controllers/enrollmentController');
const Enrollment = require('../../models/Enrollment');
const User = require('../../models/User');
const Course = require('../../models/Course');

jest.mock('../../models/Enrollment');
jest.mock('../../models/User');
jest.mock('../../models/Course');

describe('EnrollmentController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('enroll', () => {
    it('should enroll a student into a course successfully', async () => {
      const req = {
        body: {
          studentId: 'validStudentId',
          courseId: 'validCourseId',
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      User.exists.mockResolvedValueOnce(true);
      Course.exists.mockResolvedValueOnce(true);
      Enrollment.findOne.mockResolvedValueOnce(null);
      Enrollment.prototype.save.mockResolvedValueOnce({});

      await EnrollmentController.enroll(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Enrollment successful' }));
    });

    it('should return error if user ID does not exist', async () => {
      const req = {
        body: {
          studentId: 'invalidStudentId',
          courseId: 'validCourseId',
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      User.exists.mockResolvedValueOnce(false);

      await EnrollmentController.enroll(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'User ID does not exist' }));
    });

    it('should return error if course ID does not exist', async () => {
      const req = {
        body: {
          studentId: 'validStudentId',
          courseId: 'invalidCourseId',
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      User.exists.mockResolvedValueOnce(true);
      Course.exists.mockResolvedValueOnce(false);

      await EnrollmentController.enroll(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Course ID does not exist' }));
    });

    it('should return error if student is already enrolled in the course', async () => {
      const req = {
        body: {
          studentId: 'validStudentId',
          courseId: 'validCourseId',
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      User.exists.mockResolvedValueOnce(true);
      Course.exists.mockResolvedValueOnce(true);
      Enrollment.findOne.mockResolvedValueOnce({});

      await EnrollmentController.enroll(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Student is already enrolled in this course' }));
    });
  });

  describe('deleteEnrollment', () => {
    it('should delete an enrollment by ID successfully', async () => {
      const req = { params: { enrollmentId: 'validEnrollmentId' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await EnrollmentController.deleteEnrollment(req, res);

      expect(Enrollment.findByIdAndDelete).toHaveBeenCalledWith('validEnrollmentId');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Enrollment deleted successfully' }));
    });
  });
  describe('getEnrollmentsByCourseId', () => {
  it('should return error if course ID is invalid', async () => {
    const req = { params: { courseId: 'invalidCourseId' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await EnrollmentController.getEnrollmentsByCourseId(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
});
