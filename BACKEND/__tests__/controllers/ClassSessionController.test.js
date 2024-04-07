const ClassSessionController = require('../../controllers/ClassSessionController');
const Course = require('../../models/Course');
const Faculty = require('../../models/Faculty');
const Room = require('../../models/Room');
const ClassSession = require('../../models/ClassSession');
const User = require('../../models/User');

jest.mock('../../models/Course');
jest.mock('../../models/Faculty');
jest.mock('../../models/Room');
jest.mock('../../models/User');
jest.mock('../../models/ClassSession');

describe('ClassSessionController', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    describe('createClassSession', () => {
        it('should create a class session successfully when valid data is provided', async () => {
            // Mock request with valid data
            const req = {
                body: {
                    course: 'validCourseId',
                    module: 'Module 1',
                    day: 'Monday',
                    time: { start: '09:00', end: '11:00' },
                    faculty: 'validFacultyId',
                    location: 'validRoomId'
                }
            };
            // Mock response object
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            // Mock the necessary database calls
            jest.spyOn(Course, 'findById').mockResolvedValueOnce({}); // Mock valid course
            jest.spyOn(Faculty, 'exists').mockResolvedValueOnce(true); // Mock faculty exists
            jest.spyOn(Room, 'findById').mockResolvedValueOnce({}); // Mock valid room
            jest.spyOn(ClassSession.prototype, 'save').mockResolvedValueOnce({ _id: 'validClassSessionId' }); // Mock successful save

            // Call the createClassSession function
            await ClassSessionController.createClassSession(req, res);

            // Check if the status and json methods were called with the expected values
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Class session created successfully' }));
        });
        it('should return error if course ID is not valid', async () => {
          const req = {
              body: {
                  course: 'invalidCourseId',
                  module: 'Module 1',
                  day: 'Monday',
                  time: { start: '09:00', end: '11:00' },
                  faculty: 'validFacultyId',
                  location: 'validRoomId'
              }
          };
          const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

          Course.findById.mockResolvedValueOnce(null);

          await ClassSessionController.createClassSession(req, res);

          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({ error: 'The provided course ID does not exist in the database. Please provide a valid course ID.' });
      });
      it('should return error if faculty ID is not valid', async () => {
        const req = {
          body: {
            course: 'validCourseId',
            module: 'Module 1',
            day: 'Monday',
            time: { start: '09:00', end: '11:00' },
            faculty: 'invalidFacultyId',
            location: 'validRoomId'
          }
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        Course.findById.mockResolvedValueOnce({});
        Faculty.exists.mockResolvedValueOnce(false);
  
        await ClassSessionController.createClassSession(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'The provided faculty member is not assigned to this course. Please assign the faculty member to this course before creating a class session or select another faculty member.' });
      });
      it('should return error if a class session already exists for a different course in the same time slot, day, and location', async () => {
        const req = {
          body: {
            course: 'validCourseId',
            module: 'Module 1',
            day: 'Monday',
            time: { start: '09:00', end: '11:00' },
            faculty: 'validFacultyId',
            location: 'validRoomId'
          }
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        Course.findById.mockResolvedValueOnce({});
        Faculty.exists.mockResolvedValueOnce(true);
        Room.findById.mockResolvedValueOnce({});
        ClassSession.findOne.mockResolvedValueOnce({ course: 'differentCourseId' });
  
        await ClassSessionController.createClassSession(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'A class session for the same day, location already exists during this time slot for a different course.' });
      });
      it('should return error if faculty is not assigned to course', async () => {
        const req = {
            body: {
                course: 'validCourseId',
                module: 'Module 1',
                day: 'Monday',
                time: { start: '09:00', end: '11:00' },
                faculty: 'invalidFacultyId',
                location: 'validRoomId'
            }
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Course.findById.mockResolvedValueOnce({});
        Faculty.exists.mockResolvedValueOnce(false);

        await ClassSessionController.createClassSession(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'The provided faculty member is not assigned to this course. Please assign the faculty member to this course before creating a class session or select another faculty member.' });
    });
    it('should return error if location ID is not valid', async () => {
      const req = {
          body: {
              course: 'validCourseId',
              module: 'Module 1',
              day: 'Monday',
              time: { start: '08:00', end: '08:30' },
              faculty: 'validFacultyId',
              location: 'invalidRoomId'
          }
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Course.findById.mockResolvedValueOnce({});
      Faculty.exists.mockResolvedValueOnce(true);
      Room.findById.mockResolvedValueOnce(null);

      await ClassSessionController.createClassSession(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'The provided location ID does not exist in the database. Please provide a valid location ID.' });
    });
    });
      describe('deleteClassSession', () => {
        it('should delete an existing class session', async () => {
          const req = {
            params: {
              classSessionId: 'existingSessionId'
            }
          };
          const mockDeletedClassSession = { _id: 'existingSessionId' };
          ClassSession.findOneAndDelete.mockResolvedValue(mockDeletedClassSession);
    
          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
          };
    
          await ClassSessionController.deleteClassSession(req, res);
    
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith({ message: 'Class session deleted successfully', classSession: mockDeletedClassSession });
        });
      });
      describe('getAllClassSessions', () => {
        it('should get all class sessions successfully', async () => {
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            ClassSession.find.mockResolvedValueOnce([]);

            await ClassSessionController.getAllClassSessions({}, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ classSessions: [] }));
        });
    });
    describe('updateClassSession', () => {
      it('should return error if course ID is not valid during update', async () => {
        const req = {
            params: { classSessionId: 'validClassSessionId' },
            body: {
                course: 'invalidCourseId',
                module: 'Updated Module',
                day: 'Tuesday',
                time: { start: '10:00', end: '12:00' },
                faculty: 'validFacultyId',
                location: 'validRoomId'
            }
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Course.findById.mockResolvedValueOnce(null);

        await ClassSessionController.updateClassSession(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'The provided course ID does not exist in the database. Please provide a valid course ID.' });
    });
    
    });
    describe('deleteClassSession', () => {
      it('should return error if class session ID is not valid', async () => {
        const req = {
          params: { classSessionId: 'invalidClassSessionId' }
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        ClassSession.findOneAndDelete.mockResolvedValueOnce(null);
  
        await ClassSessionController.deleteClassSession(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Class session not found' });
      });
    });
    
});
