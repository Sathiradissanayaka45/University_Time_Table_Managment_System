const jwt = require('jsonwebtoken');
const UserController = require('../../controllers/UserController');
const User = require('../../models/User');

jest.mock('../../models/User');
jest.mock('jsonwebtoken');

describe('UserController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('register', () => {
    it('should register a new user successfully', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({});

      const req = {
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password',
          role: 'Student',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await UserController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Student registration successful' });
    });

    it('should handle existing email during registration', async () => {
      User.findOne.mockResolvedValue({ email: 'test@example.com' });

      const req = {
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password',
          role: 'Student',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await UserController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email already exists' });
    });
it('should handle invalid role during registration', async () => {
  const req = {
    body: {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password',
      role: 'InvalidRole', // Providing an invalid role
    },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  // Mocking User.findOne to return null, indicating the email doesn't exist yet
  User.findOne.mockResolvedValue(null);

  await UserController.register(req, res);

  expect(res.status).toHaveBeenCalledWith(400); // Ensure status 400 is returned for an invalid role
  expect(res.json).toHaveBeenCalledWith({ error: 'Invalid role value' });
});

           
    it('should handle internal server error during registration', async () => {
      User.findOne.mockRejectedValue(new Error('Database Error'));

      const req = {
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password',
          role: 'Student',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await UserController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      const existingUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
        role: 'Student',
      };

      User.findOne.mockResolvedValue(existingUser);
      jwt.sign.mockReturnValue('mocked-token');

      const req = {
        body: {
          email: 'test@example.com',
          password: 'password',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await UserController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        token: 'mocked-token',
        message: 'Student login success',
        user: {
          username: existingUser.username,
          email: existingUser.email,
          role: existingUser.role,
        },
      });
    });

    it('should handle invalid email during login', async () => {
      User.findOne.mockResolvedValue(null);

      const req = {
        body: {
          email: 'nonexistent@example.com',
          password: 'password',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await UserController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email' });
    });

    it('should handle invalid password during login', async () => {
      User.findOne.mockResolvedValue({ email: 'test@example.com', password: 'differentpassword' });

      const req = {
        body: {
          email: 'test@example.com',
          password: 'password',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await UserController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid password' });
    });

    it('should handle internal server error during login', async () => {
      User.findOne.mockRejectedValue(new Error('Database Error'));

      const req = {
        body: {
          email: 'test@example.com',
          password: 'password',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await UserController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });

    it('should handle invalid JWT secret during login', async () => {
      User.findOne.mockResolvedValue({ email: 'test@example.com', password: 'password', role: 'Student' });
      jwt.sign.mockImplementation(() => {
        throw new Error('Invalid JWT Secret');
      });

      const req = {
        body: {
          email: 'test@example.com',
          password: 'password',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await UserController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });
});
