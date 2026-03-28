const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN
});

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  user.password = undefined;
  res.status(statusCode).json({ status: 'success', token, data: { user } });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password, phone, role: email === 'admin@gmail.com' ? 'admin' : 'user' });
    createSendToken(user, 201, res);
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: err.message || 'Signup failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    createSendToken(user, 200, res);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message || 'Login failed' });
  }
};

exports.getMe = async (req, res) => {
  res.json({ status: 'success', data: { user: req.user } });
};
