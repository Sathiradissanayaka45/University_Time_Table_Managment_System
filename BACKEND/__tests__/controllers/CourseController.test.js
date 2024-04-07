const CourseController = require('../../controllers/CourseController');
const Course = require('../../models/Course');

jest.mock('../../models/Course');

describe('TimetableController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
describe('CourseController - createCourse', () => {
    it('should create a course successfully', async () => {
        // Mock request and response objects
        const req = { body: { name: 'Test Course', code: 'TEST123', description: 'Test Description', credits: 3 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
          
        // Call the createCourse function
        await CourseController.createCourse(req, res);
      
        // Check if the status and json methods were called with the expected values
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Course created successfully', course: expect.any(Object) });
      });
      
      

  it('should return an error if course with the same code already exists', async () => {
    const req = { body: { name: 'Existing Course', code: 'TEST123', description: 'Existing Description', credits: 3 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    jest.spyOn(Course, 'findOne').mockResolvedValueOnce(req.body);

    await CourseController.createCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'A course with this code already exists' });
  });

  it('should handle internal server error', async () => {
    const req = { body: { name: 'Test Course', code: 'TEST123', description: 'Test Description', credits: 3 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    jest.spyOn(Course.prototype, 'save').mockRejectedValueOnce(new Error('Test Error'));

    await CourseController.createCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

describe('CourseController - getAllCourses', () => {
  it('should get all courses successfully', async () => {
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const courses = [
      { name: 'Course 1', code: 'COURSE1', description: 'Description 1', credits: 3 },
      { name: 'Course 2', code: 'COURSE2', description: 'Description 2', credits: 4 }
    ];

    jest.spyOn(Course, 'find').mockResolvedValue(courses);

    await CourseController.getAllCourses(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ courses });
  });

  it('should handle internal server error', async () => {
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    jest.spyOn(Course, 'find').mockRejectedValueOnce(new Error('Test Error'));

    await CourseController.getAllCourses(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

describe('CourseController - getCourseById', () => {
  it('should get course by ID successfully', async () => {
    const req = { params: { id: '606f7474b19e8c0d18c8f390' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const course = { name: 'Course 1', code: 'COURSE1', description: 'Description 1', credits: 3 };
    jest.spyOn(Course, 'findById').mockResolvedValue(course);

    await CourseController.getCourseById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ course });
  });

  it('should get course by code successfully', async () => {
    const req = { params: { id: 'COURSE1' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const course = { name: 'Course 1', code: 'COURSE1', description: 'Description 1', credits: 3 };
    jest.spyOn(Course, 'findOne').mockResolvedValue(course);

    await CourseController.getCourseById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ course });
  });

  it('should return error if course not found', async () => {
    const req = { params: { id: '606f7474b19e8c0d18c8f390' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    jest.spyOn(Course, 'findById').mockResolvedValue(null);

    await CourseController.getCourseById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Course not found' });
  });

  it('should handle internal server error', async () => {
    const req = { params: { id: '606f7474b19e8c0d18c8f390' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    jest.spyOn(Course, 'findById').mockRejectedValueOnce(new Error('Test Error'));

    await CourseController.getCourseById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

describe('CourseController - updateCourseById', () => {
  it('should update course by ID successfully', async () => {
    const req = { params: { id: '606f7474b19e8c0d18c8f390' }, body: { name: 'Updated Course', description: 'Updated Description', credits: 4 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const updatedCourse = { name: 'Updated Course', code: 'COURSE 1', description: 'Updated Description', credits: 4 };
    jest.spyOn(Course, 'findByIdAndUpdate').mockResolvedValue(updatedCourse);

    await CourseController.updateCourseById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Course updated successfully', course: updatedCourse });
  });

  it('should update course by code successfully', async () => {
    const req = { params: { id: 'COURSE1' }, body: { name: 'Updated Course', description: 'Updated Description', credits: 4 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const updatedCourse = { name: 'Updated Course', code: 'COURSE1', description: 'Updated Description', credits: 4 };
    jest.spyOn(Course, 'findOneAndUpdate').mockResolvedValue(updatedCourse);

    await CourseController.updateCourseById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Course updated successfully', course: updatedCourse });
  });

  it('should return error if course not found', async () => {
    const req = { params: { id: '606f7474b19e8c0d18c8f390' }, body: { name: 'Updated Course', description: 'Updated Description', credits: 4 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    jest.spyOn(Course, 'findByIdAndUpdate').mockResolvedValue(null);

    await CourseController.updateCourseById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Course not found' });
  });

  it('should handle internal server error', async () => {
    const req = { params: { id: '606f7474b19e8c0d18c8f390' }, body: { name: 'Updated Course', description: 'Updated Description', credits: 4 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    jest.spyOn(Course, 'findByIdAndUpdate').mockRejectedValueOnce(new Error('Test Error'));

    await CourseController.updateCourseById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});

describe('CourseController - deleteCourseById', () => {
  it('should delete course by ID successfully', async () => {
    const req = { params: { id: '606f7474b19e8c0d18c8f390' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const deletedCourse = { name: 'Deleted Course', code: 'COURSE1', description: 'Deleted Description', credits: 3 };
    jest.spyOn(Course, 'findByIdAndDelete').mockResolvedValue(deletedCourse);

    await CourseController.deleteCourseById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Course deleted successfully', course: deletedCourse });
  });

  it('should delete course by code successfully', async () => {
    const req = { params: { id: 'COURSE1' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const deletedCourse = { name: 'Deleted Course', code: 'COURSE1', description: 'Deleted Description', credits: 3 };
    jest.spyOn(Course, 'findOneAndDelete').mockResolvedValue(deletedCourse);

    await CourseController.deleteCourseById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Course deleted successfully', course: deletedCourse });
  });

  it('should return error if course not found', async () => {
    const req = { params: { id: '606f7474b19e8c0d18c8f390' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    jest.spyOn(Course, 'findByIdAndDelete').mockResolvedValue(null);

    await CourseController.deleteCourseById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Course not found' });
  });

  it('should handle internal server error', async () => {
    const req = { params: { id: '606f7474b19e8c0d18c8f390' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    jest.spyOn(Course, 'findByIdAndDelete').mockRejectedValueOnce(new Error('Test Error'));

    await CourseController.deleteCourseById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
});