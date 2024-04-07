const jwt = require('jsonwebtoken');
const User = require('../models/User');

const roleSuccessMessages = {
  Student: 'Student login success',
  Admin: 'Admin login success',
  Faculty: 'Faculty login success',
};

const UserController = {
  register: async (req, res) => {
    try {
      const { username, email, password, role } = req.body;
  
      // Check if the email exists
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ error: 'Email already exists' });
      }
  
      // Create a new user
      const newUser = new User({ username, email, password, role });
  
      try {
        // Save the user to the database
        await newUser.save();
  
        // Determine the appropriate success message based on the role
        let successMessage = '';
        switch (role) {
          case 'Student':
            successMessage = 'Student registration successful';
            break;
          case 'Admin':
            successMessage = 'Admin registration successful';
            break;
          case 'Faculty':
            successMessage = 'Faculty registration successful';
            break;
          default:
            // If the role is invalid, return a 400 status
            return res.status(400).json({ error: 'Invalid role value' });
        }
  
        res.status(201).json({ message: successMessage });
      } catch (error) {
        if (error.name === 'ValidationError' && error.errors.role) {
          // Handle validation error for invalid role
          return res.status(400).json({ error: 'Invalid role value' });
        }
        throw error; // Throw other errors for global error handling
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if the user exists
      const user = await User.findOne({ email });

      console.log('Entered email:', email);
      console.log('Retrieved user:', user);

      if (!user) {
        return res.status(401).json({ error: 'Invalid email' });
      }

      // Compare the provided password with the stored password (plain text)
      if (password !== user.password) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      // Determine the appropriate success message based on the user's role
      const successMessage = roleSuccessMessages[user.role] || 'Login success';

      // Generate a JWT token
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token expiration time
      });

      res.status(200).json({ token, message: successMessage, user: {
        username: user.username,
        email: user.email,
        role: user.role
      }});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = UserController;

