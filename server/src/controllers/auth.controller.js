import bcrypt from 'bcryptjs';

import User from 'src/models/user.model';
import generateTokenAndSetCookie from 'src/utils/generateTokenAndSetCookie.util';

const signup = async (req, res) => {
  try {
    const { userName, fullName, password, email } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { userName }],
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      userName,
      fullName,
      email,
      password: hashedPassword,
    });

    if (user) {
      generateTokenAndSetCookie(res, user);
      await user.save();
    }

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
      data: {},
    });
  }
};

const signin = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(400).json({
        error: 'Invalid credentials',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        error: 'Invalid credentials',
      });
    }

    generateTokenAndSetCookie(res, user);

    return res.status(200).json({
      success: true,
      message: 'User signed in successfully',
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
      data: {},
    });
  }
};

const signout = async (req, res) => {
  try {
    res.clearCookie('token');

    return res.status(200).json({
      success: true,
      message: 'User signed out successfully',
      data: {},
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
      data: {},
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    return res.status(200).json({
      success: true,
      message: 'User details fetched successfully',
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
      data: {},
    });
  }
};

export { signup, signin, signout, getMe };
