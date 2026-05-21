const { body } = require('express-validator');
const fs = require('fs');
const path = require('path');
const util = require('util');
const User = require('../models/User');
const { signToken } = require('../utils/jwt');
//added in auth
const registerValidators = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['admin', 'customer']).withMessage('Invalid role selected'),
];

const loginValidators = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = String(email || '').toLowerCase().trim();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).render('pages/register', {
        title: 'Register',
        error: 'Email already exists',
      });
    }

    const finalRole = role === 'admin' ? 'admin' : 'customer';

    const user = await User.create({ name, email: normalizedEmail, password, role: finalRole });
    const token = signToken({ id: user._id, role: user.role });

    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    return res.redirect('/');
  } catch (error) {
    console.error('Register error:', error);
    try {
      fs.appendFileSync(
        path.join(__dirname, '..', 'register-error.log'),
        `[${new Date().toISOString()}] ${util.inspect(error, { depth: 6 })}\n\n`
      );
    } catch (logError) {
      console.error('Failed writing register-error.log', logError);
    }

    if (error?.code === 11000) {
      return res.status(400).render('pages/register', {
        title: 'Register',
        error: 'Email already exists',
      });
    }

    return res.status(400).render('pages/register', {
      title: 'Register',
      error:
        process.env.NODE_ENV === 'production'
          ? 'Unable to register with provided details. Please check your input.'
          : error?.message || 'Unable to register with provided details. Please check your input.',
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || '').toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).render('pages/login', {
        title: 'Login',
        error: 'Invalid credentials',
      });
    }

    const token = signToken({ id: user._id, role: user.role });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    return res.redirect('/');
  } catch (error) {
    return res.status(400).render('pages/login', {
      title: 'Login',
      error: 'Unable to login. Please try again.',
    });
  }
};

const logout = (req, res) => {
  res.clearCookie('token');
  return res.redirect('/login');
};

const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  return res.render('customer/profile', {
    title: 'Profile',
    user,
  });
};

const apiLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = signToken({ id: user._id, role: user.role });
  return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

const apiRegister = async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'Email already exists' });
  }

  const user = await User.create({ name, email, password, role: 'customer' });
  const token = signToken({ id: user._id, role: user.role });
  return res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

module.exports = {
  registerValidators,
  loginValidators,
  register,
  login,
  logout,
  getProfile,
  apiLogin,
  apiRegister,
};
