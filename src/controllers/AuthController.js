const bcrypt = require('bcryptjs');
const { generateToken } = require('../config/jwt');
const User = require('../models/User');

const AuthController = {
  async register(req, res) {
    try {
      const { email, password, fullName } = req.body;

      if (!email || !password || !fullName) {
        return res.status(400).json({ error: 'Email, password, and full name are required' });
      }

      // Check if user already exists
      const existingUser = await User.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const newUser = await User.createUser(email, passwordHash, fullName);
      const token = generateToken(newUser.id);

      res.status(201).json({
        message: 'User registered successfully',
        user: newUser,
        token,
      });
    } catch (error) {
      console.error('=== REGISTRATION CRASH ===', error);
      res.status(500).json({ 
        error: 'Internal server error', 
        message: error.message || String(error),
        stack: error.stack,
        DEBUG_URL_MISSING: !process.env.DATABASE_URL,
        DEBUG_ALL_VARIABLES: Object.keys(process.env).join(', ')
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = await User.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken(user.id);

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
        },
        token,
      });
    } catch (error) {
      console.error('=== LOGIN CRASH ===', error);
      res.status(500).json({ 
        error: 'Internal server error', 
        message: error.message || String(error)
      });
    }
  },

  async getProfile(req, res) {
    try {
      const user = await User.getUserById(req.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        createdAt: user.created_at,
      });
    } catch (error) {
      res.status(500).json({ error: error.message || String(error) });
    }
  },

  async updateProfile(req, res) {
    try {
      const { fullName, email } = req.body;

      const updatedUser = await User.updateUser(req.userId, { fullName, email });
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          fullName: updatedUser.full_name,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message || String(error) });
    }
  },
};

module.exports = AuthController;
