const Faculty = require('../../models/Faculty');
const User = require('../../models/User');
const Course = require('../../models/Course');
const facultyController = require('../../controllers/FacultyController');

jest.mock('../../models/Course');
jest.mock('../../models/User');
jest.mock('../../models/Faculty');

describe('Faculty Controller - assignFacultyToCourse', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should return 400 if facultyId is invalid', async () => {
    // Mock request object with invalid facultyId
    const req = { 
      body: { facultyId: 'invalidId', courseId: 'courseId' } 
    };

    // Mock response object
    const res = { 
      status: jest.fn().mockReturnThis(), 
      json: jest.fn() 
    };

    // Call the assignFacultyToCourse function
    await facultyController.assignFacultyToCourse(req, res);

    // Check if the status method was called with 400
    expect(res.status).toHaveBeenCalledWith(400);

    // Check if the json method was called with the expected response
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid faculty ID' });
  });
});
describe('Faculty Controller - getAllFaculty', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get all faculty successfully', async () => {
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const allFaculty = [{ _id: 'facultyId1', userId: 'userId1', courseId: 'courseId1' }, { _id: 'facultyId2', userId: 'userId2', courseId: 'courseId2' }];
    Faculty.find.mockResolvedValue(allFaculty);

    await facultyController.getAllFaculty(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ faculty: allFaculty });
  });
  it('should handle internal server error', async () => {
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Faculty.find.mockRejectedValue(new Error('Test error'));

    await facultyController.getAllFaculty(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
describe('Faculty Controller - getAllFaculty', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get all faculty successfully', async () => {
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const allFaculty = [{ _id: 'facultyId1', userId: 'userId1', courseId: 'courseId1' }, { _id: 'facultyId2', userId: 'userId2', courseId: 'courseId2' }];
    jest.spyOn(Faculty, 'find').mockResolvedValueOnce(allFaculty);

    await facultyController.getAllFaculty(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ faculty: allFaculty });
  });

  it('should handle internal server error', async () => {
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    jest.spyOn(Faculty, 'find').mockRejectedValueOnce(new Error('Test error'));

    await facultyController.getAllFaculty(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});